import { eq } from "drizzle-orm";
import { ROLES, PERMISSIONS } from "@samud/config";
import { db, client } from "../index.js";
import {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
  categories,
  brands,
  products,
  productInventory,
  settings,
} from "../schema/index.js";

async function seed() {
  if (!db || !client) {
    console.error(
      "DATABASE_URL environment variable is required to run seeding.",
    );
    process.exit(1);
  }

  console.log("🌱 Starting database seeding...");

  try {
    // 1. Seed Roles
    console.log("--> Seeding roles...");
    const roleValues = (Object.values(ROLES) as string[]).map((name) => ({
      name,
      description: `Default system role for ${name}`,
    }));
    await db.insert(roles).values(roleValues).onConflictDoNothing();
    const allRoles = await db.select().from(roles);
    const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));

    // 2. Seed Permissions
    console.log("--> Seeding permissions...");
    const permissionValues = (Object.values(PERMISSIONS) as string[]).map(
      (action) => ({
        moduleAction: action,
        description: `Permission access for ${action}`,
      }),
    );
    await db.insert(permissions).values(permissionValues).onConflictDoNothing();
    const allPermissions = await db.select().from(permissions);
    const permissionMap = new Map(
      allPermissions.map((p) => [p.moduleAction, p.id]),
    );

    // 3. Seed Role-Permission Mappings
    console.log("--> Seeding role permissions...");
    const rolePermissionInserts: { roleId: string; permissionId: string }[] =
      [];

    // SUPER_ADMIN receives all system permissions
    const superAdminId = roleMap.get(ROLES.SUPER_ADMIN);
    if (superAdminId) {
      for (const permissionId of permissionMap.values()) {
        rolePermissionInserts.push({ roleId: superAdminId, permissionId });
      }
    }

    // ADMIN receives business management permissions (excludes admins.* and settings.*)
    const adminId = roleMap.get(ROLES.ADMIN);
    if (adminId) {
      for (const [action, permissionId] of permissionMap.entries()) {
        if (!action.startsWith("admins.") && !action.startsWith("settings.")) {
          rolePermissionInserts.push({ roleId: adminId, permissionId });
        }
      }
    }

    // CUSTOMER receives customer feature access
    const customerId = roleMap.get(ROLES.CUSTOMER);
    if (customerId) {
      const customerActions: string[] = [
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.CATEGORIES_VIEW,
        PERMISSIONS.BRANDS_VIEW,
        PERMISSIONS.CUSTOMERS_UPDATE,
        PERMISSIONS.ORDERS_VIEW,
      ];
      for (const action of customerActions) {
        const pId = permissionMap.get(action);
        if (pId) {
          rolePermissionInserts.push({ roleId: customerId, permissionId: pId });
        }
      }
    }

    if (rolePermissionInserts.length > 0) {
      await db
        .insert(rolePermissions)
        .values(rolePermissionInserts)
        .onConflictDoNothing();
    }

    // 4. Seed Super Admin User Account
    console.log("--> Seeding default Super Admin user...");
    const adminEmail = "admin@samudshabkat.com";
    // Pre-computed Argon2 hash for secure local setup ("SuperAdmin123!")
    const passwordHash =
      "$argon2id$v=19$m=65536,t=3,p=4$VDR2N2E0Y3o2c0oxM2psVQ$y1Zf4rQJj2vKkV8Yf/93P39y+L4O+Wd+Z9hU6uCgHlU";
    await db
      .insert(users)
      .values({
        email: adminEmail,
        passwordHash,
        firstName: "System",
        lastName: "Super Admin",
        isActive: true,
      })
      .onConflictDoNothing();
    const [superAdminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (superAdminUser && superAdminId) {
      await db
        .insert(userRoles)
        .values({
          userId: superAdminUser.id,
          roleId: superAdminId,
        })
        .onConflictDoNothing();
    }

    // 5. Seed IT Hardware Categories
    console.log("--> Seeding sample IT hardware categories...");
    const sampleCategories = [
      {
        name: "Laptops",
        slug: "laptops",
        description: "Enterprise Ultrabooks and performance notebooks",
        sortOrder: 1,
      },
      {
        name: "Desktops & Workstations",
        slug: "desktops-workstations",
        description:
          "High-performance business desktops and precision workstations",
        sortOrder: 2,
      },
      {
        name: "Monitors & Displays",
        slug: "monitors-displays",
        description:
          "Professional color-accurate UHD and UltraWide business monitors",
        sortOrder: 3,
      },
      {
        name: "Networking & Security",
        slug: "networking-security",
        description:
          "Managed switches, WiFi 6E access points, and enterprise firewalls",
        sortOrder: 4,
      },
      {
        name: "Server & Storage",
        slug: "server-storage",
        description:
          "Rackmount servers, network attached storage (NAS), and NVMe drives",
        sortOrder: 5,
      },
    ];
    await db.insert(categories).values(sampleCategories).onConflictDoNothing();
    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

    // 6. Seed Brands
    console.log("--> Seeding sample industry brands...");
    const sampleBrands = [
      {
        name: "Dell Technologies",
        slug: "dell",
        description:
          "Precision systems, OptiPlex desktops, and Ultrasharp monitors",
      },
      {
        name: "ASUS",
        slug: "asus",
        description: "ProArt display systems and enterprise WiFi network gear",
      },
      {
        name: "Cisco",
        slug: "cisco",
        description:
          "Enterprise network infrastructure and Meraki security hardware",
      },
      {
        name: "Lenovo",
        slug: "lenovo",
        description: "ThinkPad notebooks and enterprise servers",
      },
      {
        name: "Synology",
        slug: "synology",
        description: "Enterprise NAS storage and hybrid cloud solutions",
      },
    ];
    await db.insert(brands).values(sampleBrands).onConflictDoNothing();
    const allBrands = await db.select().from(brands);
    const brandMap = new Map(allBrands.map((b) => [b.slug, b.id]));

    // 7. Seed Sample Products with JSONB Specifications
    console.log(
      "--> Seeding sample hardware catalog with JSONB specifications...",
    );
    const laptopCat = categoryMap.get("laptops");
    const netCat = categoryMap.get("networking-security");
    const monCat = categoryMap.get("monitors-displays");
    const dellBrand = brandMap.get("dell");
    const ciscoBrand = brandMap.get("cisco");
    const asusBrand = brandMap.get("asus");

    if (laptopCat && dellBrand) {
      await db
        .insert(products)
        .values({
          name: "Dell XPS 16 Laptop (Intel Core Ultra 9)",
          slug: "dell-xps-16-ultra-9",
          sku: "DELL-XPS16-U9-64GB",
          shortDescription:
            "Flagship workstation laptop with premium NPU processing and OLED touchscreen.",
          description:
            "Experience advanced AI workloads and uncompromising engineering efficiency with the Dell XPS 16 powered by Intel Core Ultra processors.",
          price: "9850.00",
          categoryId: laptopCat,
          brandId: dellBrand,
          specifications: {
            processor: "Intel Core Ultra 9 185H (24MB Cache, 16 Cores)",
            ram: "64GB LPDDR5X 7467MT/s",
            storage: "2TB PCIe NVMe M.2 SSD",
            display: "16.3-inch 4K+ UHD+ OLED Touch (3840x2400)",
            gpu: "NVIDIA GeForce RTX 4070 8GB GDDR6",
            os: "Windows 11 Pro Enterprise",
          },
          isActive: true,
        })
        .onConflictDoNothing();
    }

    if (netCat && ciscoBrand) {
      await db
        .insert(products)
        .values({
          name: "Cisco Catalyst 9300 48-Port PoE+ Switch",
          slug: "cisco-catalyst-9300-48p",
          sku: "CISCO-C9300-48P",
          shortDescription:
            "Next-generation stackable switching platform for IoT and secure networking.",
          description:
            "The Cisco Catalyst 9300 Series is Cisco's lead stackable enterprise switching platform built for zero-trust security, mobility, and high-speed enterprise throughput.",
          price: "15400.00",
          categoryId: netCat,
          brandId: ciscoBrand,
          specifications: {
            ports: "48x 1G PoE+ Ethernet Ports",
            uplinks: "Modular Network Module (10G/25G/40G QSFP+)",
            poe_budget: "715W AC Hot-Swap Power Supply",
            stack_bandwidth: "480 Gbps Stacking throughput",
            management: "Cisco DNA Center & IOS XE Software",
          },
          isActive: true,
        })
        .onConflictDoNothing();
    }

    if (monCat && asusBrand) {
      await db
        .insert(products)
        .values({
          name: "ASUS ProArt Display PA32UCX-P 32-inch 4K HDR Monitor",
          slug: "asus-proart-pa32ucx-p",
          sku: "ASUS-PA32UCX-P",
          shortDescription:
            "Mini-LED backlight reference display engineered for production studios.",
          description:
            "ASUS ProArt PA32UCX-P 32-inch 4K HDR monitor features peak brightness of 1200 nits and Quantum-dot technology with hardware calibration.",
          price: "7200.00",
          categoryId: monCat,
          brandId: asusBrand,
          specifications: {
            panel_size: "32.0-inch 16:9 4K UHD (3840x2160)",
            panel_type: "IPS Mini-LED with 1152 zone dynamic local dimming",
            color_accuracy: "Delta E < 1, DCI-P3 99%, Adobe RGB 99.5%",
            refresh_rate: "60Hz professional studio timing",
            connectivity:
              "Thunderbolt 3 USB-C (60W PD), HDMI 2.0 x3, DisplayPort 1.2",
          },
          isActive: true,
        })
        .onConflictDoNothing();
    }

    // Seed initial single-pool product inventory
    console.log("--> Seeding initial single-pool product inventory...");
    const allProducts = await db.select().from(products);
    for (const p of allProducts) {
      await db
        .insert(productInventory)
        .values({
          productId: p.id,
          currentStock: 100,
          reservedStock: 0,
          reorderLevel: 10,
          minStock: 5,
          maxStock: 1000,
        })
        .onConflictDoNothing();
    }

    // 8. Seed Default Platform Configuration
    console.log("--> Seeding platform settings...");
    const existingSettings = await db.select().from(settings);
    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        companyName: "Samud Shabkat E-Commerce Ordering Platform",
        supportEmail: "support@samudshabkat.com",
        contactPhone: "+971 4 123 4567",
        officeAddress: "Sheikh Zayed Road, Dubai, United Arab Emirates",
        defaultCurrency: "AED",
        isMaintenanceMode: false,
      });
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
