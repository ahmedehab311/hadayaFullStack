import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.create({
    data: {
      nameAr: "برج الشوكولاتة الفاخر",
      nameEn: "Artisan Chocolate Tower",
      slug: "artisan-chocolate-tower",
      price: 245.00,
      status: 'PUBLISHED',
      isBestSeller: true,
      collections: {
        create: {
          name: "تهنئة",
          slug: "congrats"
        }
      }
    }
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())