import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SocketEvents } from '@sewanexa/shared-types';
import { ProviderProfile } from '../models/ProviderProfile.js';

let io: SocketIOServer | null = null;

export const initSocketIO = (httpServer: HttpServer, allowedOrigin: string): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigin || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room (e.g., user:ID, provider:ID, booking:ID)
    socket.on(SocketEvents.JOIN_ROOM, ({ room }: { room: string }) => {
      socket.join(room);
      console.log(`[Socket.IO] ${socket.id} joined room: ${room}`);
    });

    // Leave room
    socket.on(SocketEvents.LEAVE_ROOM, ({ room }: { room: string }) => {
      socket.leave(room);
      console.log(`[Socket.IO] ${socket.id} left room: ${room}`);
    });

    // Real-time Provider Location Update
    socket.on(
      SocketEvents.PROVIDER_LOCATION_UPDATE,
      async ({
        providerId,
        longitude,
        latitude,
      }: {
        providerId: string;
        longitude: number;
        latitude: number;
      }) => {
        try {
          await ProviderProfile.findByIdAndUpdate(providerId, {
            location: { type: 'Point', coordinates: [longitude, latitude] },
          });

          // Broadcast to listening clients (e.g. customers tracking assigned provider)
          io?.to(`provider_tracking:${providerId}`).emit(SocketEvents.PROVIDER_LOCATION_UPDATE, {
            providerId,
            longitude,
            latitude,
          });
        } catch (err) {
          console.error('[Socket.IO] Provider location update error:', err);
        }
      }
    );

    // Provider online/offline toggle
    socket.on(
      SocketEvents.PROVIDER_STATUS_TOGGLE,
      async ({ providerId, isOnline }: { providerId: string; isOnline: boolean }) => {
        try {
          await ProviderProfile.findByIdAndUpdate(providerId, { isOnline });
          io?.emit(SocketEvents.PROVIDER_STATUS_TOGGLE, { providerId, isOnline });
        } catch (err) {
          console.error('[Socket.IO] Status toggle error:', err);
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketIO = (): SocketIOServer | null => {
  return io;
};

