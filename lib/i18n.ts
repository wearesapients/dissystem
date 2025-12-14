/**
 * Internationalization - RU/EN
 */

export type Locale = 'ru' | 'en'

export const translations = {
  // Navigation
  nav: {
    dashboard: { en: 'Dashboard', ru: 'Дашборд' },
    thoughts: { en: 'Thoughts', ru: 'Мысли' },
    entities: { en: 'Entities', ru: 'Сущности' },
    conceptArt: { en: 'Concept Art', ru: 'Концепт-арт' },
    lore: { en: 'Lore', ru: 'Лор' },
    logout: { en: 'Sign out', ru: 'Выйти' },
    // Game Data separator
    gameData: { en: 'Game Data', ru: 'Игровые данные' },
    // Submenu - Units Section
    unitsSection: { en: 'Units', ru: 'Юниты' },
    allUnits: { en: 'All', ru: 'Все' },
    unitsMelee: { en: 'Melee', ru: 'Ближний бой' },
    unitsRanged: { en: 'Ranged', ru: 'Стрелки' },
    unitsMage: { en: 'Mage', ru: 'Маги' },
    unitsSupport: { en: 'Support', ru: 'Поддержка' },
    // Submenu - Entities
    allEntities: { en: 'All', ru: 'Все' },
    heroes: { en: 'Heroes', ru: 'Герои' },
    units: { en: 'Units', ru: 'Юниты' },
    factions: { en: 'Factions', ru: 'Фракции' },
    spells: { en: 'Spells', ru: 'Заклинания' },
    artifacts: { en: 'Artifacts', ru: 'Артефакты' },
    locations: { en: 'Locations', ru: 'Локации' },
    // Submenu - Thoughts
    allThoughts: { en: 'All', ru: 'Все' },
    thoughtsOther: { en: 'Other', ru: 'Другое' },
    drafts: { en: 'Drafts', ru: 'Черновики' },
    pending: { en: 'Pending', ru: 'На утверждении' },
    inProgress: { en: 'In Progress', ru: 'В работе' },
    approved: { en: 'Approved', ru: 'Утверждено' },
    rejected: { en: 'Rejected', ru: 'Отклонено' },
    // Submenu - Concept Art
    allArt: { en: 'All', ru: 'Все' },
    // Submenu - Lore
    allLore: { en: 'All', ru: 'Все' },
    loreOther: { en: 'Other', ru: 'Другое' },
    artHeroes: { en: 'Heroes', ru: 'Герои' },
    artUnits: { en: 'Units', ru: 'Юниты' },
    artFactions: { en: 'Factions', ru: 'Фракции' },
    artSpells: { en: 'Spells', ru: 'Заклинания' },
    artArtifacts: { en: 'Artifacts', ru: 'Артефакты' },
    artLocations: { en: 'Locations', ru: 'Локации' },
    artObjects: { en: 'Objects', ru: 'Объекты' },
    // Submenu - Onboarding
    onboarding: { en: 'Onboarding', ru: 'Онбординг' },
    allOnboarding: { en: 'All', ru: 'Все' },
    onboardingDesignSystem: { en: 'Design System', ru: 'Дизайн-система' },
    onboardingGameFiles: { en: 'Game Files', ru: 'Файлы игры' },
    onboardingGuidelines: { en: 'Guidelines', ru: 'Гайдлайны' },
    onboardingTools: { en: 'Tools', ru: 'Инструменты' },
    onboardingReferences: { en: 'References', ru: 'Референсы' },
  },
  
  // Common
  common: {
    all: { en: 'All', ru: 'Все' },
    search: { en: 'Search...', ru: 'Поиск...' },
    create: { en: 'Create', ru: 'Создать' },
    save: { en: 'Save', ru: 'Сохранить' },
    cancel: { en: 'Cancel', ru: 'Отмена' },
    delete: { en: 'Delete', ru: 'Удалить' },
    edit: { en: 'Edit', ru: 'Редактировать' },
    back: { en: 'Back', ru: 'Назад' },
    loading: { en: 'Loading...', ru: 'Загрузка...' },
    noResults: { en: 'No results', ru: 'Нет результатов' },
    total: { en: 'Total', ru: 'Всего' },
    records: { en: 'records', ru: 'записей' },
    saveError: { en: 'Save error', ru: 'Ошибка сохранения' },
    confirmDelete: { en: 'Are you sure you want to delete?', ru: 'Вы уверены, что хотите удалить?' },
  },
  
  // Thoughts
  thoughts: {
    title: { en: 'Thoughts & Notes', ru: 'Мысли и заметки' },
    newThought: { en: '+ New Thought', ru: '+ Новая мысль' },
    pin: { en: 'Pin', ru: 'Закрепить' },
    unpin: { en: 'Unpin', ru: 'Открепить' },
    toWork: { en: 'To Work', ru: 'В работу' },
    approve: { en: 'Approve', ru: 'Утвердить' },
    reject: { en: 'Reject', ru: 'Отклонить' },
    rejectionReason: { en: 'Rejection reason', ru: 'Причина отклонения' },
    linkedEntity: { en: 'Linked entity', ru: 'Связь с сущностью' },
    author: { en: 'Author', ru: 'Автор' },
    assignee: { en: 'Assignee', ru: 'Исполнитель' },
    created: { en: 'Created', ru: 'Создано' },
    updated: { en: 'Updated', ru: 'Обновлено' },
    comments: { en: 'Comments', ru: 'Комментарии' },
    addComment: { en: 'Add comment...', ru: 'Написать комментарий...' },
    send: { en: 'Send', ru: 'Отправить' },
    noComments: { en: 'No comments yet', ru: 'Пока нет комментариев' },
  },
  
  // Filters
  filters: {
    title: { en: 'Filters', ru: 'Фильтры' },
    allStatuses: { en: 'All statuses', ru: 'Все статусы' },
    allPriorities: { en: 'All priorities', ru: 'Все приоритеты' },
    allTags: { en: 'All tags', ru: 'Все теги' },
    reset: { en: 'Clear all filters', ru: 'Сбросить фильтры' },
    sort: { en: 'Sort', ru: 'Сортировка' },
    sortNewest: { en: 'Newest first', ru: 'Сначала новые' },
    sortOldest: { en: 'Oldest first', ru: 'Сначала старые' },
    sortUpdated: { en: 'Recently updated', ru: 'Недавно обновлённые' },
    sortPriority: { en: 'By priority', ru: 'По приоритету' },
    sortName: { en: 'By name', ru: 'По имени' },
    tags: { en: 'Tags', ru: 'Теги' },
    entityType: { en: 'Entity Type', ru: 'Тип сущности' },
  },
  
  // Statuses
  status: {
    draft: { en: 'Draft', ru: 'Черновик' },
    pending: { en: 'Pending', ru: 'На утверждении' },
    inProgress: { en: 'In Progress', ru: 'В работе' },
    approved: { en: 'Approved', ru: 'Утверждено' },
    rejected: { en: 'Rejected', ru: 'Отклонено' },
    inReview: { en: 'In Review', ru: 'На проверке' },
  },
  
  // Priority
  priority: {
    low: { en: 'Low', ru: 'Низкий' },
    medium: { en: 'Medium', ru: 'Средний' },
    high: { en: 'High', ru: 'Высокий' },
    critical: { en: 'Critical', ru: 'Критический' },
  },
  
  // Entity types
  entityType: {
    unit: { en: 'Unit', ru: 'Юнит' },
    hero: { en: 'Hero', ru: 'Герой' },
    faction: { en: 'Faction', ru: 'Фракция' },
    spell: { en: 'Spell', ru: 'Заклинание' },
    artifact: { en: 'Artifact', ru: 'Артефакт' },
    location: { en: 'Location', ru: 'Локация' },
    object: { en: 'Object', ru: 'Объект' },
    other: { en: 'Other', ru: 'Другое' },
  },
  
  // Entity types plural
  entityTypePlural: {
    unit: { en: 'Units', ru: 'Юниты' },
    hero: { en: 'Heroes', ru: 'Герои' },
    faction: { en: 'Factions', ru: 'Фракции' },
    spell: { en: 'Spells', ru: 'Заклинания' },
    artifact: { en: 'Artifacts', ru: 'Артефакты' },
    location: { en: 'Locations', ru: 'Локации' },
    object: { en: 'Objects', ru: 'Объекты' },
    other: { en: 'Other', ru: 'Другое' },
  },
  
  // Entities page
  entities: {
    title: { en: 'Game Entities', ru: 'Игровые сущности' },
    newEntity: { en: 'New Entity', ru: 'Новая сущность' },
    backToEntities: { en: 'Back to entities', ru: 'Назад к сущностям' },
    backToEntity: { en: 'Back to', ru: 'Назад к' },
    noEntities: { en: 'No entities found', ru: 'Сущности не найдены' },
    concepts: { en: 'concepts', ru: 'концептов' },
    loreEntries: { en: 'lore entries', ru: 'записей лора' },
    thoughtsCount: { en: 'thoughts', ru: 'мыслей' },
    category: { en: 'Entity category', ru: 'Категория сущности' },
    name: { en: 'Name', ru: 'Название' },
    code: { en: 'Code', ru: 'Код' },
    shortDescription: { en: 'Short description', ru: 'Краткое описание' },
    fullDescription: { en: 'Full description', ru: 'Полное описание' },
    autoGenerateCode: { en: 'Generate automatically', ru: 'Генерировать автоматически' },
    codeHint: { en: 'Unique code for identification (letters, numbers, underscores)', ru: 'Уникальный код для идентификации (буквы, цифры, подчёркивания)' },
    createEntity: { en: 'Create Entity', ru: 'Создать сущность' },
    saveChanges: { en: 'Save Changes', ru: 'Сохранить изменения' },
    deleteEntity: { en: 'Delete entity', ru: 'Удалить сущность' },
    deleteConfirmTitle: { en: 'Delete Entity', ru: 'Удаление сущности' },
    deleteConfirmText: { en: 'This action cannot be undone', ru: 'Это действие нельзя отменить' },
    deleteConfirmQuestion: { en: 'Are you sure you want to delete', ru: 'Вы уверены, что хотите удалить сущность' },
    deleteWarning: { en: 'Links to concept arts, lore and thoughts will be removed, but the records will be preserved.', ru: 'Связи с концепт-артами, лором и мыслями будут удалены, но сами записи сохранятся.' },
    forEntity: { en: 'For entity', ru: 'Для сущности' },
    changesApplied: { en: 'Changes will be automatically applied to all linked sections', ru: 'Изменения автоматически применятся во всех связанных разделах' },
  },
  
  // Entity tabs
  entityTabs: {
    stats: { en: 'Stats', ru: 'Характеристики' },
    conceptArts: { en: 'Concept Arts', ru: 'Концепт-арты' },
    lore: { en: 'Lore', ru: 'Лор' },
    thoughts: { en: 'Thoughts', ru: 'Мысли' },
    activity: { en: 'Activity', ru: 'Активность' },
    noConceptArts: { en: 'No linked concept arts', ru: 'Нет связанных концепт-артов' },
    noLoreEntries: { en: 'No linked lore entries', ru: 'Нет связанных записей лора' },
    noThoughts: { en: 'No linked thoughts', ru: 'Нет связанных мыслей' },
    addConcept: { en: 'Add concept', ru: 'Добавить концепт' },
    addLore: { en: 'Add entry', ru: 'Добавить запись' },
    addThought: { en: 'Add thought', ru: 'Добавить мысль' },
    activitySoon: { en: 'Activity history coming soon', ru: 'История активности скоро появится' },
  },
  
  // Stats
  stats: {
    drafts: { en: 'Drafts', ru: 'Черновики' },
    pending: { en: 'Pending', ru: 'На утверждении' },
    inProgress: { en: 'In Progress', ru: 'В работе' },
    approved: { en: 'Approved', ru: 'Утверждено' },
    rejected: { en: 'Rejected', ru: 'Отклонено' },
  },
  
  // Dashboard
  dashboard: {
    title: { en: 'Dashboard', ru: 'Дашборд' },
    overview: { en: 'Desolates project overview', ru: 'Обзор проекта Desolates' },
    gameEntities: { en: 'Game Entities', ru: 'Игровые сущности' },
    conceptArts: { en: 'Concept Arts', ru: 'Концепт-арты' },
    loreEntries: { en: 'Lore Entries', ru: 'Записи лора' },
    recentActivity: { en: 'Recent Activity', ru: 'Последняя активность' },
    noActivity: { en: 'No activity', ru: 'Нет активности' },
    thoughtStatuses: { en: 'Thought statuses', ru: 'Статусы мыслей' },
  },
  
  // Concept Art
  conceptArt: {
    title: { en: 'Concept Arts', ru: 'Концепт-арты' },
    subtitle: { en: 'Visual materials', ru: 'Визуальные материалы проекта' },
    upload: { en: 'Upload', ru: 'Загрузить' },
    newArt: { en: 'Upload Concept Art', ru: 'Загрузить концепт-арт' },
    editArt: { en: 'Edit Concept Art', ru: 'Редактировать концепт-арт' },
    backToArts: { en: 'Back to concept arts', ru: 'Назад к концепт-артам' },
    backToArt: { en: 'Back to concept', ru: 'Назад к концепту' },
    noArts: { en: 'No concept arts', ru: 'Нет концепт-артов' },
    image: { en: 'Image', ru: 'Изображение' },
    dragDrop: { en: 'Drag & drop image here', ru: 'Перетащите изображение сюда' },
    orClick: { en: 'or click to select file', ru: 'или нажмите для выбора файла' },
    fileTypes: { en: 'PNG, JPG, WebP, GIF • up to 10MB', ru: 'PNG, JPG, WebP, GIF • до 10MB' },
    uploading: { en: 'Uploading...', ru: 'Загрузка...' },
    linkEntity: { en: 'Link to entity', ru: 'Привязка к сущности' },
    selectEntity: { en: 'Select entity', ru: 'Выбрать сущность' },
    description: { en: 'Description / Comment', ru: 'Описание / Комментарий' },
    descriptionPlaceholder: { en: 'Concept details, notes for team...', ru: 'Детали концепта, заметки для команды...' },
    deleteConfirm: { en: 'Delete concept art?', ru: 'Удалить концепт-арт?' },
    deleteWarning: { en: 'This action cannot be undone. The image file will also be deleted.', ru: 'Это действие нельзя отменить. Файл изображения также будет удалён.' },
    batchUpload: { en: 'Batch Upload', ru: 'Пакетная загрузка' },
    batchUploadDesc: { en: 'Upload multiple concept arts for one entity', ru: 'Загрузите несколько концепт-артов для одной сущности' },
    allArtsLinked: { en: 'All arts will be linked', ru: 'Все арты будут привязаны' },
    filesCount: { en: 'files', ru: 'файлов' },
    ready: { en: 'ready', ru: 'готово' },
    errors: { en: 'errors', ru: 'ошибок' },
    inQueue: { en: 'in queue', ru: 'в очереди' },
    commonSettings: { en: 'Common settings for all arts', ru: 'Общие настройки для всех артов' },
    canSelectMultiple: { en: 'You can select multiple files', ru: 'Можно выбрать несколько файлов' },
  },
  
  // Form
  form: {
    title: { en: 'Title', ru: 'Заголовок' },
    content: { en: 'Content', ru: 'Содержание' },
    status: { en: 'Status', ru: 'Статус' },
    priority: { en: 'Priority', ru: 'Приоритет' },
    tags: { en: 'Tags (comma separated)', ru: 'Теги (через запятую)' },
    color: { en: 'Color', ru: 'Цвет' },
    entity: { en: 'Link to entity', ru: 'Связь с сущностью' },
    noLink: { en: 'No link', ru: 'Без связи' },
    notAssigned: { en: 'Not assigned', ru: 'Не назначен' },
  },
  
  // Onboarding
  onboarding: {
    title: { en: 'Onboarding', ru: 'Онбординг' },
    subtitle: { en: 'Project basics for new team members', ru: 'Базовые материалы для новых участников команды' },
    newCard: { en: '+ New Card', ru: '+ Новая карточка' },
    createCard: { en: 'Create Card', ru: 'Создать карточку' },
    createFirst: { en: 'Create first card', ru: 'Создать первую карточку' },
    noCards: { en: 'No onboarding cards', ru: 'Нет карточек онбординга' },
    noCardsHint: { en: 'Start building onboarding materials for your team', ru: 'Начните создавать материалы для погружения команды' },
    category: { en: 'Category', ru: 'Категория' },
    gallery: { en: 'Image Gallery', ru: 'Галерея изображений' },
    uploadImages: { en: 'Upload images', ru: 'Загрузить изображения' },
    imageCaption: { en: 'Image caption...', ru: 'Подпись к изображению...' },
    linksReferences: { en: 'Links & References', ru: 'Ссылки и референсы' },
    addLink: { en: 'Add link', ru: 'Добавить ссылку' },
    description: { en: 'Description', ru: 'Описание' },
    titlePlaceholder: { en: 'Card title...', ru: 'Название карточки...' },
    descriptionPlaceholder: { en: 'Detailed description, instructions, notes...', ru: 'Подробное описание, инструкции, заметки...' },
    order: { en: 'Display order', ru: 'Порядок отображения' },
    sortOrder: { en: 'By order', ru: 'По порядку' },
    parentCard: { en: 'Parent card', ru: 'Родительская карточка' },
    pinHint: { en: 'Pinned cards appear at the top', ru: 'Закреплённые карточки отображаются вверху' },
    allCards: { en: 'All', ru: 'Все' },
    designSystem: { en: 'Design System', ru: 'Дизайн-система' },
    gameFiles: { en: 'Game Files', ru: 'Файлы игры' },
    guidelines: { en: 'Guidelines', ru: 'Гайдлайны' },
    tools: { en: 'Tools', ru: 'Инструменты' },
    references: { en: 'References', ru: 'Референсы' },
  },
  
  // Units
  units: {
    title: { en: 'Units', ru: 'Юниты' },
    newUnit: { en: '+ New Unit', ru: '+ Новый юнит' },
    createUnit: { en: 'Create Unit', ru: 'Создать юнит' },
    createFirst: { en: 'Create first unit', ru: 'Создать первого юнита' },
    noUnits: { en: 'No units found', ru: 'Юниты не найдены' },
    noUnitsHint: { en: 'Start creating game units for your factions', ru: 'Начните создавать игровых юнитов для фракций' },
    saveChanges: { en: 'Save Changes', ru: 'Сохранить изменения' },
    attacks: { en: 'attacks', ru: 'атак' },
    // Form sections
    sectionBasic: { en: 'Basic Info', ru: 'Основное' },
    sectionDefense: { en: 'Defense', ru: 'Защита' },
    sectionImmunities: { en: 'Immunities & Wards', ru: 'Иммунитеты и обереги' },
    sectionAttack: { en: 'Attacks', ru: 'Атаки' },
    // Fields
    faction: { en: 'Faction', ru: 'Фракция' },
    selectFaction: { en: 'Select faction', ru: 'Выберите фракцию' },
    name: { en: 'Name', ru: 'Название' },
    role: { en: 'Role', ru: 'Роль' },
    roleMelee: { en: 'Melee', ru: 'Ближний бой' },
    roleRanged: { en: 'Ranged', ru: 'Стрелок' },
    roleMage: { en: 'Mage', ru: 'Маг' },
    roleSupport: { en: 'Support', ru: 'Поддержка' },
    level: { en: 'Level', ru: 'Уровень' },
    xpCurrent: { en: 'Current XP', ru: 'Текущий опыт' },
    xpToNext: { en: 'XP to next', ru: 'XP до след.' },
    description: { en: 'Description', ru: 'Описание' },
    hpMax: { en: 'HP Max', ru: 'HP макс.' },
    armor: { en: 'Armor', ru: 'Броня' },
    hpRegen: { en: 'HP Regen', ru: 'Реген HP' },
    xpOnKill: { en: 'XP on kill', ru: 'XP за убийство' },
    immunities: { en: 'Immunities', ru: 'Иммунитеты' },
    wards: { en: 'Wards', ru: 'Обереги' },
    // Attack fields
    attack: { en: 'Attack', ru: 'Атака' },
    addAttack: { en: 'Add Attack', ru: 'Добавить атаку' },
    attackName: { en: 'Attack Name', ru: 'Название атаки' },
    hitChance: { en: 'Hit Chance', ru: 'Шанс попадания' },
    damage: { en: 'Damage', ru: 'Урон' },
    heal: { en: 'Heal', ru: 'Лечение' },
    source: { en: 'Source', ru: 'Источник' },
    initiative: { en: 'Initiative', ru: 'Инициатива' },
    reach: { en: 'Reach', ru: 'Радиус' },
    targets: { en: 'Targets', ru: 'Цели' },
    // Damage sources
    sourceWeapon: { en: 'Weapon', ru: 'Физический' },
    sourceAir: { en: 'Air', ru: 'Воздух' },
    sourceFire: { en: 'Fire', ru: 'Огонь' },
    sourceWater: { en: 'Water', ru: 'Вода' },
    sourceEarth: { en: 'Earth', ru: 'Земля' },
    sourceLife: { en: 'Life', ru: 'Жизнь' },
    sourceDeath: { en: 'Death', ru: 'Смерть' },
    sourceMind: { en: 'Mind', ru: 'Разум' },
    // Reach options
    reachAdjacent: { en: 'Adjacent', ru: 'Ближние' },
    reachAny: { en: 'Any', ru: 'Любые' },
    // Sort options
    sortLevel: { en: 'By level', ru: 'По уровню' },
    sortHp: { en: 'By HP', ru: 'По HP' },
  },
  
  // Lore
  lore: {
    title: { en: 'Lore & Narrative', ru: 'Лор и нарратив' },
    subtitle: { en: 'Game world stories and descriptions', ru: 'Истории и описания игрового мира' },
    newEntry: { en: '+ New Entry', ru: '+ Новая запись' },
    createEntry: { en: 'Create Entry', ru: 'Создать запись' },
    createFirst: { en: 'Create first entry', ru: 'Создать первую запись' },
    noEntries: { en: 'No lore entries', ru: 'Нет записей лора' },
    noEntriesHint: { en: 'Start building your game world narrative', ru: 'Начните создавать нарратив игрового мира' },
    type: { en: 'Lore Type', ru: 'Тип записи' },
    allTypes: { en: 'All types', ru: 'Все типы' },
    archived: { en: 'Archived', ru: 'В архиве' },
    sortVersion: { en: 'By version', ru: 'По версии' },
    primaryEntity: { en: 'Primary Entity', ru: 'Основная сущность' },
    linkedEntities: { en: 'Linked Entities', ru: 'Связанные сущности' },
    addLinkedEntity: { en: 'Add linked entity', ru: 'Добавить связь' },
    selectPrimaryEntity: { en: 'Select primary entity', ru: 'Выбрать основную сущность' },
    optional: { en: 'optional', ru: 'опционально' },
    summary: { en: 'Summary', ru: 'Краткое описание' },
    summaryPlaceholder: { en: 'Brief summary of this lore entry...', ru: 'Краткое описание записи лора...' },
    summaryHint: { en: 'Short summary for previews and search', ru: 'Краткое описание для превью и поиска' },
    titlePlaceholder: { en: 'Entry title...', ru: 'Заголовок записи...' },
    contentPlaceholder: { en: 'Full lore content. Supports markdown...', ru: 'Полное содержание лора. Поддерживает markdown...' },
    tagsPlaceholder: { en: 'hero, backstory, faction', ru: 'герой, предыстория, фракция' },
    existingTags: { en: 'Existing tags', ru: 'Существующие теги' },
    changeNote: { en: 'Change Note', ru: 'Заметка об изменении' },
    changeNotePlaceholder: { en: 'What changed in this version?', ru: 'Что изменилось в этой версии?' },
    changeNoteHint: { en: 'Will be saved in version history', ru: 'Сохранится в истории версий' },
    versionHistory: { en: 'Version History', ru: 'История версий' },
    current: { en: 'Current', ru: 'Текущая' },
    latest: { en: 'Latest', ru: 'Последняя' },
    restore: { en: 'Restore', ru: 'Восстановить' },
    confirmRestore: { en: 'Restore version {version}? This will create a new version.', ru: 'Восстановить версию {version}? Будет создана новая версия.' },
    confirmDelete: { en: 'Delete this lore entry? This cannot be undone.', ru: 'Удалить эту запись лора? Это действие нельзя отменить.' },
    changeStatus: { en: 'Change Status', ru: 'Изменить статус' },
    showChanges: { en: 'Show changes', ru: 'Показать изменения' },
    hideChanges: { en: 'Hide changes', ru: 'Скрыть изменения' },
    titleChange: { en: 'Title change', ru: 'Изменение заголовка' },
    summaryChange: { en: 'Summary change', ru: 'Изменение описания' },
    contentChanges: { en: 'Content changes', ru: 'Изменения в контенте' },
    noContentChanges: { en: 'No content changes', ru: 'Нет изменений в контенте' },
    linesAdded: { en: 'added', ru: 'добавлено' },
    linesRemoved: { en: 'removed', ru: 'удалено' },
  },
}

export function t(key: string, locale: Locale): string {
  const keys = key.split('.')
  let value: unknown = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }
  
  if (value && typeof value === 'object' && locale in value) {
    return (value as Record<string, string>)[locale]
  }
  
  return key
}

// Helper to get status label
export function getStatusLabel(status: string, locale: Locale): string {
  const map: Record<string, string> = {
    DRAFT: t('status.draft', locale),
    PENDING: t('status.pending', locale),
    IN_PROGRESS: t('status.inProgress', locale),
    APPROVED: t('status.approved', locale),
    REJECTED: t('status.rejected', locale),
    IN_REVIEW: t('status.inReview', locale),
  }
  return map[status] || status
}

// Helper to get priority label
export function getPriorityLabel(priority: string, locale: Locale): string {
  const map: Record<string, string> = {
    LOW: t('priority.low', locale),
    MEDIUM: t('priority.medium', locale),
    HIGH: t('priority.high', locale),
    CRITICAL: t('priority.critical', locale),
  }
  return map[priority] || priority
}

// Helper to get entity type label
export function getEntityTypeLabel(type: string, locale: Locale): string {
  const map: Record<string, string> = {
    UNIT: t('entityType.unit', locale),
    HERO: t('entityType.hero', locale),
    FACTION: t('entityType.faction', locale),
    SPELL: t('entityType.spell', locale),
    ARTIFACT: t('entityType.artifact', locale),
    LOCATION: t('entityType.location', locale),
    OBJECT: t('entityType.object', locale),
    OTHER: t('entityType.other', locale),
  }
  return map[type] || type
}

// Helper to get entity type label plural
export function getEntityTypePluralLabel(type: string, locale: Locale): string {
  const map: Record<string, string> = {
    UNIT: t('entityTypePlural.unit', locale),
    HERO: t('entityTypePlural.hero', locale),
    FACTION: t('entityTypePlural.faction', locale),
    SPELL: t('entityTypePlural.spell', locale),
    ARTIFACT: t('entityTypePlural.artifact', locale),
    LOCATION: t('entityTypePlural.location', locale),
    OBJECT: t('entityTypePlural.object', locale),
    OTHER: t('entityTypePlural.other', locale),
  }
  return map[type] || type
}

