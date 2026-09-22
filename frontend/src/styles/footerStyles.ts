// Главная обертка футера

export const footerWrapper = 'bottom-0 left-0 right-0 z-50 bg-bg-header border-b border-neutral-800/50';

export const footerContainer = 'max-w-[1440px] h-[250px] bg-[#2E2E2E] mt-[120px] mx-auto px-[138px] py-[55px] flex justify-between relative w-full';

// Колонка 1: Логотип и копирайт
export const footerLogoCol = 'w-[273px] flex flex-col mt-[8px]'; // Подгоняем mt под визуальное выравнивание
export const footerSubText = 'text-[12px] font-normal text-white/70 leading-none mt-4';

// Колонка 2: Навигация (Якорные ссылки)
export const footerNavCol = 'w-[120px] h-[125px] mt-[19px] ml-[77px] flex flex-col gap-[16.33px]';
export const footerNavLink = 'text-[16px] font-normal text-white leading-none hover:text-[#FFFC4F] transition-colors duration-200 cursor-pointer';

// Колонка 3: Контакты и адрес
export const footerContactsCol = 'w-[274px] mt-[19px] ml-[101px] flex flex-col gap-[16.33px] text-left';
export const footerContactText = 'text-[16px] font-normal text-white leading-none';

// Колонка 4: Юридическая инфа и соцсети
export const footerSocialsCol = 'w-[240px] h-[120px] mt-[24px] ml-[77px] flex flex-col gap-4 text-left';
export const footerLegalLink = 'text-[12px] font-normal text-white/50 leading-none underline hover:text-white transition-colors duration-200 cursor-pointer';

// Кнопки соцсетей
export const footerSocialRow = 'flex gap-[11px] mt-auto';
export const footerSocialBtn = 'w-[30px] h-[30px] rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-accent hover:text-[#2E2E2E] hover:scale-110 active:scale-95 transition-all duration-300';