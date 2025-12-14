/**
 * Database Seed - Full Data
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sapients.dev' },
    update: {},
    create: {
      email: 'admin@sapients.dev',
      name: 'Александр Морозов',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✓ Admin user created')
  
  // Create other users
  const artistPassword = await bcrypt.hash('artist123', 12)
  const artist = await prisma.user.upsert({
    where: { email: 'artist@sapients.dev' },
    update: {},
    create: {
      email: 'artist@sapients.dev',
      name: 'Мария Иванова',
      passwordHash: artistPassword,
      role: 'ARTIST',
    },
  })
  
  const writerPassword = await bcrypt.hash('writer123', 12)
  await prisma.user.upsert({
    where: { email: 'writer@sapients.dev' },
    update: {},
    create: {
      email: 'writer@sapients.dev',
      name: 'Дмитрий Петров',
      passwordHash: writerPassword,
      role: 'WRITER',
    },
  })
  console.log('✓ Users created')
  
  // Create Game Entities
  const necromancer = await prisma.gameEntity.upsert({
    where: { code: 'HERO_NECROMANCER' },
    update: {},
    create: {
      code: 'HERO_NECROMANCER',
      name: 'Некромант',
      type: 'HERO',
      description: 'Мастер тёмных искусств, способный поднимать мёртвых и управлять армией нежити. Один из ключевых героев фракции Нежити.',
      shortDescription: 'Повелитель нежити',
      createdById: admin.id,
    },
  })
  
  const paladin = await prisma.gameEntity.upsert({
    where: { code: 'HERO_PALADIN' },
    update: {},
    create: {
      code: 'HERO_PALADIN',
      name: 'Паладин',
      type: 'HERO',
      description: 'Святой воин, несущий свет и исцеление. Способен благословлять союзников и наносить огромный урон нежити.',
      shortDescription: 'Святой воин света',
      createdById: admin.id,
    },
  })
  
  const skeleton = await prisma.gameEntity.upsert({
    where: { code: 'UNIT_SKELETON' },
    update: {},
    create: {
      code: 'UNIT_SKELETON',
      name: 'Скелет-воин',
      type: 'UNIT',
      description: 'Базовый юнит нежити. Дешёвый и многочисленный, но слабый в одиночку.',
      shortDescription: 'Базовый юнит нежити',
      createdById: admin.id,
    },
  })
  
  const undead = await prisma.gameEntity.upsert({
    where: { code: 'FACTION_UNDEAD' },
    update: {},
    create: {
      code: 'FACTION_UNDEAD',
      name: 'Нежить',
      type: 'FACTION',
      description: 'Армия мёртвых под командованием могущественных некромантов. Сила в количестве и тёмной магии.',
      shortDescription: 'Армия тьмы',
      createdById: admin.id,
    },
  })
  
  const haven = await prisma.gameEntity.upsert({
    where: { code: 'FACTION_HAVEN' },
    update: {},
    create: {
      code: 'FACTION_HAVEN',
      name: 'Убежище',
      type: 'FACTION',
      description: 'Королевство людей, основанное на вере и чести. Сильные защитные способности и исцеление.',
      shortDescription: 'Королевство людей',
      createdById: admin.id,
    },
  })
  
  const darkRitual = await prisma.gameEntity.upsert({
    where: { code: 'SPELL_DARK_RITUAL' },
    update: {},
    create: {
      code: 'SPELL_DARK_RITUAL',
      name: 'Тёмный ритуал',
      type: 'SPELL',
      description: 'Мощное заклинание некроманта, позволяющее воскресить павших врагов как союзников.',
      shortDescription: 'Воскрешение павших',
      createdById: admin.id,
    },
  })
  console.log('✓ Game entities created')
  
  // Create Alliance faction if it doesn't exist (we'll use Haven as Alliance)
  // Find Haven faction for units
  const allianceFaction = await prisma.gameEntity.findFirst({
    where: { code: 'FACTION_HAVEN' },
  })
  
  if (allianceFaction) {
    // Create Units with Attacks
    // 1. Acolyte - SUPPORT
    const acolyte = await prisma.unit.upsert({
      where: { id: 'unit-acolyte' },
      update: {},
      create: {
        id: 'unit-acolyte',
        factionId: allianceFaction.id,
        name: 'Acolyte',
        role: 'SUPPORT',
        level: 1,
        xpCurrent: 0,
        xpToNext: 80,
        hpMax: 50,
        armor: 0,
        immunities: [],
        wards: [],
        hpRegenPercent: 0.05,
        xpOnKill: 20,
        description: 'A devoted healer of the Alliance. Channels life energy to restore wounded allies.',
        createdById: admin.id,
        attacks: {
          create: [{
            name: 'Healing Light',
            hitChance: 1.0,
            damage: null,
            heal: 20,
            damageSource: 'LIFE',
            initiative: 10,
            reach: 'ANY',
            targets: 1,
          }],
        },
      },
    })
    
    // 2. Titan - MELEE (heavy)
    const titan = await prisma.unit.upsert({
      where: { id: 'unit-titan' },
      update: {},
      create: {
        id: 'unit-titan',
        factionId: allianceFaction.id,
        name: 'Titan',
        role: 'MELEE',
        level: 1,
        xpCurrent: 0,
        xpToNext: 475,
        hpMax: 250,
        armor: 0,
        immunities: [],
        wards: [],
        hpRegenPercent: 0.05,
        xpOnKill: 120,
        description: 'A towering giant of the Alliance. Crushes enemies with devastating blows.',
        createdById: admin.id,
        attacks: {
          create: [{
            name: 'Crushing Blow',
            hitChance: 0.8,
            damage: 60,
            heal: null,
            damageSource: 'WEAPON',
            initiative: 50,
            reach: 'ADJACENT',
            targets: 1,
          }],
        },
      },
    })
    
    // 3. Squire - MELEE
    const squire = await prisma.unit.upsert({
      where: { id: 'unit-squire' },
      update: {},
      create: {
        id: 'unit-squire',
        factionId: allianceFaction.id,
        name: 'Squire',
        role: 'MELEE',
        level: 1,
        xpCurrent: 0,
        xpToNext: 80,
        hpMax: 100,
        armor: 0,
        immunities: [],
        wards: [],
        hpRegenPercent: 0.05,
        xpOnKill: 20,
        description: 'A young warrior in training. Basic infantry unit of the Alliance.',
        createdById: admin.id,
        attacks: {
          create: [{
            name: 'Sword Strike',
            hitChance: 0.8,
            damage: 25,
            heal: null,
            damageSource: 'WEAPON',
            initiative: 50,
            reach: 'ADJACENT',
            targets: 1,
          }],
        },
      },
    })
    
    // 4. Archer - RANGED
    const archer = await prisma.unit.upsert({
      where: { id: 'unit-archer' },
      update: {},
      create: {
        id: 'unit-archer',
        factionId: allianceFaction.id,
        name: 'Archer',
        role: 'RANGED',
        level: 1,
        xpCurrent: 0,
        xpToNext: 70,
        hpMax: 45,
        armor: 0,
        immunities: [],
        wards: [],
        hpRegenPercent: 0.05,
        xpOnKill: 20,
        description: 'A skilled marksman of the Alliance. Strikes enemies from afar.',
        createdById: admin.id,
        attacks: {
          create: [{
            name: 'Arrow Shot',
            hitChance: 0.8,
            damage: 25,
            heal: null,
            damageSource: 'WEAPON',
            initiative: 60,
            reach: 'ANY',
            targets: 1,
          }],
        },
      },
    })
    
    // 5. Apprentice - MAGE (AOE)
    const apprentice = await prisma.unit.upsert({
      where: { id: 'unit-apprentice' },
      update: {},
      create: {
        id: 'unit-apprentice',
        factionId: allianceFaction.id,
        name: 'Apprentice',
        role: 'MAGE',
        level: 1,
        xpCurrent: 0,
        xpToNext: 75,
        hpMax: 35,
        armor: 0,
        immunities: [],
        wards: [],
        hpRegenPercent: 0.05,
        xpOnKill: 15,
        description: 'A novice mage learning the ways of air magic. Can strike multiple targets.',
        createdById: admin.id,
        attacks: {
          create: [{
            name: 'Air Blast',
            hitChance: 0.8,
            damage: 15,
            heal: null,
            damageSource: 'AIR',
            initiative: 40,
            reach: 'ANY',
            targets: 6,
          }],
        },
      },
    })
    
    console.log('✓ Units created:', { acolyte: acolyte.name, titan: titan.name, squire: squire.name, archer: archer.name, apprentice: apprentice.name })
  } else {
    console.log('⚠ Haven faction not found, skipping units creation')
  }
  
  // Create Concept Arts
  await prisma.conceptArt.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Некромант - основной дизайн',
        description: 'Финальный дизайн героя Некроманта в полный рост',
        imageUrl: '/concept/necromancer.jpg',
        status: 'APPROVED',
        tags: ['герой', 'нежить', 'финал'],
        entityId: necromancer.id,
        createdById: artist.id,
      },
      {
        title: 'Скелет-воин - вариации',
        description: 'Три варианта дизайна скелета-воина',
        imageUrl: '/concept/skeleton.jpg',
        status: 'IN_REVIEW',
        tags: ['юнит', 'нежить'],
        entityId: skeleton.id,
        createdById: artist.id,
      },
      {
        title: 'Паладин - броня',
        description: 'Детализация брони паладина',
        imageUrl: '/concept/paladin-armor.jpg',
        status: 'DRAFT',
        tags: ['герой', 'убежище', 'wip'],
        entityId: paladin.id,
        createdById: artist.id,
      },
    ],
  })
  console.log('✓ Concept arts created')
  
  // Create Lore Entries
  await prisma.loreEntry.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'История Некроманта Валориса',
        content: `# Валорис — Повелитель Мёртвых

Валорис был когда-то великим целителем в королевстве Убежища. Но трагическая потеря семьи от чумы толкнула его на тёмный путь...

## Ранние годы

Родившись в семье травников, Валорис с детства проявлял талант к магии жизни...

## Падение

После эпидемии, унёсшей его жену и детей, Валорис обратился к запретным текстам...`,
        summary: 'Предыстория главного некроманта игры',
        status: 'APPROVED',
        version: 2,
        tags: ['герой', 'нежить', 'предыстория'],
        entityId: necromancer.id,
        createdById: admin.id,
      },
      {
        title: 'Устройство фракции Нежити',
        content: `# Иерархия Нежити

Армия нежити имеет чёткую иерархию, основанную на силе и древности...`,
        summary: 'Описание структуры фракции',
        status: 'IN_REVIEW',
        tags: ['фракция', 'лор'],
        entityId: undead.id,
        createdById: admin.id,
      },
    ],
  })
  console.log('✓ Lore entries created')
  
  // Create Thoughts
  await prisma.thought.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Баланс некроманта в PvP',
        content: 'Нужно пересмотреть скейлинг урона некроманта на поздних уровнях. Сейчас он слишком силён после 15 уровня. Предлагаю снизить базовый урон заклинаний на 15% и увеличить кулдауны.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        entityId: necromancer.id,
        tags: ['баланс', 'pvp', 'срочно'],
        color: '#FF375F',
        isPinned: true,
        createdById: admin.id,
      },
      {
        title: 'Новая механика призыва',
        content: 'Идея: добавить возможность жертвовать HP для усиления призванных существ. Это добавит тактическую глубину и риск/награду.',
        status: 'PENDING',
        priority: 'MEDIUM',
        entityId: necromancer.id,
        tags: ['механика', 'идея'],
        color: '#FF9F0A',
        createdById: admin.id,
      },
      {
        title: 'Визуальный стиль фракции',
        content: 'Предлагаю использовать более холодные тона для нежити — синий и фиолетовый вместо зелёного. Это выделит их от других фракций.',
        status: 'APPROVED',
        priority: 'LOW',
        entityId: undead.id,
        tags: ['визуал', 'арт'],
        color: '#BF5AF2',
        createdById: admin.id,
      },
      {
        title: 'Переработка анимации скелетов',
        content: 'Текущие анимации атаки слишком медленные. Нужно ускорить и добавить вариативность для разных типов оружия.',
        status: 'DRAFT',
        priority: 'MEDIUM',
        entityId: skeleton.id,
        tags: ['анимация', 'юниты'],
        color: '#0A84FF',
        createdById: admin.id,
      },
      {
        title: 'Режим выживания',
        content: 'Добавить режим бесконечных волн врагов с лидербордом. Может стать популярным для стримеров.',
        status: 'REJECTED',
        priority: 'LOW',
        rejectionReason: 'Слишком большой scope для текущего этапа. Вернёмся после релиза основной игры.',
        tags: ['режимы', 'идея'],
        color: '#8e8e93',
        createdById: admin.id,
      },
    ],
  })
  console.log('✓ Thoughts created')
  
  // Create Activity Logs with proper metadata for linking
  await prisma.activityLog.createMany({
    data: [
      {
        type: 'CREATED',
        description: 'Создана сущность "Некромант"',
        entityId: necromancer.id,
        userId: admin.id,
        metadata: { itemType: 'entity', itemId: necromancer.id },
      },
      {
        type: 'CREATED',
        description: 'Создана сущность "Паладин"',
        entityId: paladin.id,
        userId: admin.id,
        metadata: { itemType: 'entity', itemId: paladin.id },
      },
      {
        type: 'STATUS_CHANGED',
        description: 'Статус концепт-арта изменён на "Утверждено"',
        entityId: necromancer.id,
        userId: admin.id,
        metadata: { itemType: 'conceptArt', itemId: 'concept-art-list' },
      },
      {
        type: 'COMMENTED',
        description: 'Добавлен комментарий к мысли "Баланс некроманта"',
        entityId: necromancer.id,
        userId: admin.id,
        metadata: { itemType: 'thought', itemId: 'thought-list' },
      },
      {
        type: 'UPDATED',
        description: 'Обновлён лор "История Некроманта"',
        entityId: necromancer.id,
        userId: admin.id,
        metadata: { itemType: 'lore', itemId: 'lore-list' },
      },
    ],
  })
  console.log('✓ Activity logs created')
  
  console.log('✅ Seeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
