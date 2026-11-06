import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Category } from '../models/Category.js';
import { SubCategory } from '../models/SubCategory.js';
import { User } from '../models/User.js';
import { ProviderProfile } from '../models/ProviderProfile.js';

const SEED_CATEGORIES = [
  {
    name: 'Home Maintenance Services',
    slug: 'home-maintenance',
    icon: 'home',
    description: 'Plumbing, electrical, painting, cleaning, and appliance repair services.',
    commissionPercentage: 10,
    order: 1,
    subcategories: [
      { name: 'Plumbing Services', slug: 'plumbing', icon: 'wrench', suggestedBasePrice: 500 },
      { name: 'Electrical Services', slug: 'electrical', icon: 'zap', suggestedBasePrice: 500 },
      { name: 'House Painting', slug: 'house-painting', icon: 'paint-roller', suggestedBasePrice: 2000 },
      { name: 'Carpentry and Furniture Repair', slug: 'carpentry', icon: 'hammer', suggestedBasePrice: 800 },
      { name: 'AC Installation and Repair', slug: 'ac-repair', icon: 'air-vent', suggestedBasePrice: 1200 },
      { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', icon: 'droplet', suggestedBasePrice: 1500 },
      { name: 'Solar Installation and Maintenance', slug: 'solar-maintenance', icon: 'sun', suggestedBasePrice: 1500 },
      { name: 'Home Appliance Repair', slug: 'appliance-repair', icon: 'tv', suggestedBasePrice: 700 },
      { name: 'House Cleaning', slug: 'house-cleaning', icon: 'sparkles', suggestedBasePrice: 1000 },
      { name: 'Pest Control', slug: 'pest-control', icon: 'shield', suggestedBasePrice: 1800 },
    ],
  },
  {
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: 'car',
    description: 'On-demand mechanics, vehicle repairs, roadside assistance, and towing in Nepal.',
    commissionPercentage: 10,
    order: 2,
    subcategories: [
      { name: 'Car Mechanic', slug: 'car-mechanic', icon: 'car', suggestedBasePrice: 800 },
      { name: 'Bike Mechanic', slug: 'bike-mechanic', icon: 'bike', suggestedBasePrice: 400 },
      { name: 'Vehicle Electrical Repair', slug: 'vehicle-electrical', icon: 'battery-charging', suggestedBasePrice: 600 },
      { name: 'Car Washing and Detailing', slug: 'car-wash', icon: 'sparkles', suggestedBasePrice: 1000 },
      { name: 'Tyre Repair and Replacement', slug: 'tyre-repair', icon: 'circle', suggestedBasePrice: 300 },
      { name: 'Battery Replacement', slug: 'battery-replacement', icon: 'battery', suggestedBasePrice: 500 },
      { name: 'Roadside Assistance', slug: 'roadside-assistance', icon: 'life-buoy', suggestedBasePrice: 1000 },
      { name: 'Vehicle Towing', slug: 'vehicle-towing', icon: 'truck', suggestedBasePrice: 2500 },
    ],
  },
  {
    name: 'Construction and Labour Services',
    slug: 'construction-and-labour',
    icon: 'hard-hat',
    description: 'Skilled masons, painters, tilers, welders, renovation and general labour.',
    commissionPercentage: 10,
    order: 3,
    subcategories: [
      { name: 'Mason', slug: 'mason', icon: 'hard-hat', suggestedBasePrice: 1200 },
      { name: 'Construction Workers', slug: 'construction-workers', icon: 'users', suggestedBasePrice: 1000 },
      { name: 'Tile and Marble Workers', slug: 'tile-marble', icon: 'grid', suggestedBasePrice: 1500 },
      { name: 'Welding Services', slug: 'welding', icon: 'flame', suggestedBasePrice: 800 },
      { name: 'Aluminium and Glass Workers', slug: 'aluminium-glass', icon: 'box', suggestedBasePrice: 1000 },
      { name: 'House Renovation', slug: 'house-renovation', icon: 'home', suggestedBasePrice: 5000 },
      { name: 'Interior Work', slug: 'interior-work', icon: 'layout', suggestedBasePrice: 3000 },
      { name: 'General Labour', slug: 'general-labour', icon: 'user', suggestedBasePrice: 800 },
    ],
  },
  {
    name: 'Personal and Lifestyle Services',
    slug: 'personal-and-lifestyle',
    icon: 'heart',
    description: 'Beauty and salon, photography, tailoring, fitness trainers, and home tutors.',
    commissionPercentage: 10,
    order: 4,
    subcategories: [
      { name: 'Beauty and Makeup Services', slug: 'beauty-makeup', icon: 'smile', suggestedBasePrice: 1500 },
      { name: 'Salon Services', slug: 'salon', icon: 'scissors', suggestedBasePrice: 600 },
      { name: 'Photography and Videography', slug: 'photography', icon: 'camera', suggestedBasePrice: 3500 },
      { name: 'Event Decoration', slug: 'event-decoration', icon: 'gift', suggestedBasePrice: 4000 },
      { name: 'Home Tutors', slug: 'home-tutors', icon: 'book', suggestedBasePrice: 2500 },
      { name: 'Fitness Trainers', slug: 'fitness-trainers', icon: 'activity', suggestedBasePrice: 2000 },
      { name: 'Tailoring Services', slug: 'tailoring', icon: 'tag', suggestedBasePrice: 500 },
    ],
  },
  {
    name: 'Professional and Technical Services',
    slug: 'professional-and-technical',
    icon: 'cpu',
    description: 'Computer & laptop repair, CCTV installation, networking, and IT support.',
    commissionPercentage: 10,
    order: 5,
    subcategories: [
      { name: 'Computer Repair', slug: 'computer-repair', icon: 'monitor', suggestedBasePrice: 700 },
      { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'laptop', suggestedBasePrice: 800 },
      { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'smartphone', suggestedBasePrice: 500 },
      { name: 'CCTV Installation', slug: 'cctv-installation', icon: 'video', suggestedBasePrice: 1500 },
      { name: 'Networking Services', slug: 'networking', icon: 'wifi', suggestedBasePrice: 1000 },
      { name: 'IT Support', slug: 'it-support', icon: 'help-circle', suggestedBasePrice: 1000 },
      { name: 'Website Development', slug: 'website-development', icon: 'code', suggestedBasePrice: 10000 },
      { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'trending-up', suggestedBasePrice: 5000 },
    ],
  },
  {
    name: 'Other Services',
    slug: 'other-services',
    icon: 'more-horizontal',
    description: 'Drivers, delivery, movers & packers, gardening, and laundry services.',
    commissionPercentage: 10,
    order: 6,
    subcategories: [
      { name: 'Drivers', slug: 'drivers', icon: 'navigation', suggestedBasePrice: 1200 },
      { name: 'Delivery Assistance', slug: 'delivery-assistance', icon: 'package', suggestedBasePrice: 400 },
      { name: 'Movers and Packers', slug: 'movers-packers', icon: 'truck', suggestedBasePrice: 4500 },
      { name: 'Gardening', slug: 'gardening', icon: 'flower', suggestedBasePrice: 800 },
      { name: 'Laundry and Ironing', slug: 'laundry', icon: 'shirt', suggestedBasePrice: 500 },
      { name: 'Pet Care', slug: 'pet-care', icon: 'heart', suggestedBasePrice: 800 },
      { name: 'Office Maintenance', slug: 'office-maintenance', icon: 'briefcase', suggestedBasePrice: 2000 },
    ],
  },
];

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB:', config.mongoUri);
    await mongoose.connect(config.mongoUri);
    console.log('[Seed] Connected.');

    // Seed Categories & Subcategories
    for (const catData of SEED_CATEGORIES) {
      const { subcategories, ...catFields } = catData;

      let category = await Category.findOne({ slug: catFields.slug });
      if (!category) {
        category = await Category.create(catFields);
        console.log(`[Seed] Created category: ${category.name}`);
      } else {
        await Category.updateOne({ _id: category._id }, { $set: catFields });
      }

      for (let i = 0; i < subcategories.length; i++) {
        const sub = subcategories[i];
        await SubCategory.findOneAndUpdate(
          { categoryId: category._id, slug: sub.slug },
          {
            $set: {
              categoryId: category._id,
              name: sub.name,
              slug: sub.slug,
              icon: sub.icon,
              suggestedBasePrice: sub.suggestedBasePrice,
              order: i + 1,
              isActive: true,
            },
          },
          { upsert: true, new: true }
        );
      }
    }
    console.log('[Seed] Categories and subcategories seeded.');

    // Seed Admin User
    const adminPhone = '9800000000';
    let adminUser = await User.findOne({ phoneNumber: adminPhone });
    if (!adminUser) {
      adminUser = await User.create({
        phoneNumber: adminPhone,
        isPhoneVerified: true,
        name: 'Sewanexa Super Admin',
        email: 'admin@sewanexa.com',
        role: 'superadmin',
        status: 'active',
      });
      console.log(`[Seed] Created admin user: ${adminUser.phoneNumber}`);
    }

    // Seed Sample Verified Provider in Lokanthali, Bhaktapur
    const providerPhone = '9841000000';
    let providerUser = await User.findOne({ phoneNumber: providerPhone });
    if (!providerUser) {
      providerUser = await User.create({
        phoneNumber: providerPhone,
        isPhoneVerified: true,
        name: 'Ramesh Sharma (Certified Plumber)',
        email: 'ramesh.plumber@gmail.com',
        role: 'provider',
        status: 'active',
      });

      const homeMaintenanceCat = await Category.findOne({ slug: 'home-maintenance' });
      const plumbingSub = await SubCategory.findOne({ slug: 'plumbing' });

      if (homeMaintenanceCat && plumbingSub) {
        await ProviderProfile.create({
          userId: providerUser._id,
          businessName: 'Sharma Plumbing Works',
          bio: '10+ years experienced certified plumber serving Kathmandu, Bhaktapur and Lalitpur. Available 24/7 for emergency leaks and pipe fitting.',
          categories: [homeMaintenanceCat._id],
          subCategories: [plumbingSub._id],
          skills: ['Pipe Fitting', 'Sanitary Repair', 'Water Tank Installation', 'Drainage'],
          experienceYears: 10,
          location: {
            type: 'Point',
            coordinates: [85.3582, 27.6715], // Lokanthali, Bhaktapur
          },
          address: {
            city: 'Bhaktapur',
            areaName: 'Lokanthali',
            formattedAddress: 'Lokanthali Chowk, Madhyapur Thimi, Bhaktapur',
          },
          serviceRadiusKm: 10,
          isOnline: true,
          pricingModel: 'fixed',
          baseRate: 500,
          documents: {
            identityDocType: 'citizenship',
            identityNumber: '27-01-70-12345',
            citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
            verificationStatus: 'verified',
            verifiedAt: new Date(),
          },
          ratings: {
            average: 4.9,
            count: 38,
          },
          wallet: {
            currentBalance: 0,
            escrowBalance: 0,
          },
        });
        console.log('[Seed] Created sample verified provider in Lokanthali.');
      }
    }

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
}

seed();
