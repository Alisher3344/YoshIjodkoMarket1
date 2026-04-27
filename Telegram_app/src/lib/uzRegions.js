// O'zbekiston hududiy ierarxiyasi
// Mini App ro'yxatdan o'tishda viloyat → shahar/tuman → maktab kaskadi uchun

export const UZ_REGIONS = {
  "Toshkent shahri": {
    cities: ["Toshkent shahri"],
    districts: [
      "Bektemir tumani",
      "Chilonzor tumani",
      "Mirobod tumani",
      "Mirzo Ulug'bek tumani",
      "Olmazor tumani",
      "Sergeli tumani",
      "Shayxontohur tumani",
      "Uchtepa tumani",
      "Yakkasaroy tumani",
      "Yashnobod tumani",
      "Yunusobod tumani",
    ],
  },
  "Toshkent viloyati": {
    cities: [
      "Olmaliq shahri",
      "Angren shahri",
      "Bekobod shahri",
      "Chirchiq shahri",
      "Nurafshon shahri",
      "Yangiyo'l shahri",
    ],
    districts: [
      "Bekobod tumani",
      "Bo'ka tumani",
      "Bo'stonliq tumani",
      "Chinoz tumani",
      "Ohangaron tumani",
      "Oqqo'rg'on tumani",
      "Parkent tumani",
      "Piskent tumani",
      "Qibray tumani",
      "Quyichirchiq tumani",
      "O'rta Chirchiq tumani",
      "Yangiyo'l tumani",
      "Yuqori Chirchiq tumani",
      "Zangiota tumani",
    ],
  },
  "Andijon viloyati": {
    cities: ["Andijon shahri", "Xonobod shahri"],
    districts: [
      "Andijon tumani",
      "Asaka tumani",
      "Baliqchi tumani",
      "Bo'z tumani",
      "Buloqboshi tumani",
      "Izboskan tumani",
      "Jalaquduq tumani",
      "Marhamat tumani",
      "Oltinko'l tumani",
      "Paxtaobod tumani",
      "Qo'rg'ontepa tumani",
      "Shahrixon tumani",
      "Ulug'nor tumani",
      "Xo'jaobod tumani",
    ],
  },
  "Buxoro viloyati": {
    cities: ["Buxoro shahri", "Kogon shahri"],
    districts: [
      "Buxoro tumani",
      "G'ijduvon tumani",
      "Jondor tumani",
      "Kogon tumani",
      "Olot tumani",
      "Peshku tumani",
      "Qorako'l tumani",
      "Qorovulbozor tumani",
      "Romitan tumani",
      "Shofirkon tumani",
      "Vobkent tumani",
    ],
  },
  "Farg'ona viloyati": {
    cities: ["Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", "Quvasoy shahri"],
    districts: [
      "Bag'dod tumani",
      "Beshariq tumani",
      "Buvayda tumani",
      "Dang'ara tumani",
      "Farg'ona tumani",
      "Furqat tumani",
      "Oltiariq tumani",
      "Qo'shtepa tumani",
      "Quva tumani",
      "Rishton tumani",
      "So'x tumani",
      "Toshloq tumani",
      "Uchko'prik tumani",
      "O'zbekiston tumani",
      "Yozyovon tumani",
    ],
  },
  "Jizzax viloyati": {
    cities: ["Jizzax shahri"],
    districts: [
      "Arnasoy tumani",
      "Baxmal tumani",
      "Do'stlik tumani",
      "Forish tumani",
      "G'allaorol tumani",
      "Mirzacho'l tumani",
      "Paxtakor tumani",
      "Yangiobod tumani",
      "Zafarobod tumani",
      "Zarbdor tumani",
      "Zomin tumani",
    ],
  },
  "Xorazm viloyati": {
    cities: ["Urganch shahri", "Xiva shahri"],
    districts: [
      "Bog'ot tumani",
      "Gurlan tumani",
      "Hazorasp tumani",
      "Qo'shko'pir tumani",
      "Shovot tumani",
      "Urganch tumani",
      "Xiva tumani",
      "Xonqa tumani",
      "Yangiariq tumani",
      "Yangibozor tumani",
      "Tuproqqal'a tumani",
    ],
  },
  "Namangan viloyati": {
    cities: ["Namangan shahri"],
    districts: [
      "Chortoq tumani",
      "Chust tumani",
      "Kosonsoy tumani",
      "Mingbuloq tumani",
      "Namangan tumani",
      "Norin tumani",
      "Pop tumani",
      "To'raqo'rg'on tumani",
      "Uchqo'rg'on tumani",
      "Uychi tumani",
      "Yangiqo'rg'on tumani",
    ],
  },
  "Navoiy viloyati": {
    cities: ["Navoiy shahri", "Zarafshon shahri"],
    districts: [
      "Konimex tumani",
      "Karmana tumani",
      "Navbahor tumani",
      "Nurota tumani",
      "Qiziltepa tumani",
      "Tomdi tumani",
      "Uchquduq tumani",
      "Xatirchi tumani",
    ],
  },
  "Qashqadaryo viloyati": {
    cities: ["Qarshi shahri", "Shahrisabz shahri"],
    districts: [
      "Chiroqchi tumani",
      "Dehqonobod tumani",
      "G'uzor tumani",
      "Kasbi tumani",
      "Kitob tumani",
      "Koson tumani",
      "Mirishkor tumani",
      "Muborak tumani",
      "Nishon tumani",
      "Qamashi tumani",
      "Qarshi tumani",
      "Shahrisabz tumani",
      "Yakkabog' tumani",
    ],
  },
  "Surxondaryo viloyati": {
    cities: ["Termiz shahri"],
    districts: [
      "Angor tumani",
      "Bandixon tumani",
      "Boysun tumani",
      "Denov tumani",
      "Jarqo'rg'on tumani",
      "Muzrabot tumani",
      "Oltinsoy tumani",
      "Qiziriq tumani",
      "Qumqo'rg'on tumani",
      "Sariosiyo tumani",
      "Sherobod tumani",
      "Sho'rchi tumani",
      "Termiz tumani",
      "Uzun tumani",
    ],
  },
  "Samarqand viloyati": {
    cities: ["Samarqand shahri", "Kattaqo'rg'on shahri"],
    districts: [
      "Bulung'ur tumani",
      "Ishtixon tumani",
      "Jomboy tumani",
      "Kattaqo'rg'on tumani",
      "Narpay tumani",
      "Nurobod tumani",
      "Oqdaryo tumani",
      "Pastdarg'om tumani",
      "Paxtachi tumani",
      "Payariq tumani",
      "Qo'shrabot tumani",
      "Samarqand tumani",
      "Toyloq tumani",
      "Urgut tumani",
    ],
  },
  "Sirdaryo viloyati": {
    cities: ["Guliston shahri", "Shirin shahri", "Yangiyer shahri"],
    districts: [
      "Boyovut tumani",
      "Guliston tumani",
      "Mirzaobod tumani",
      "Oqoltin tumani",
      "Sayxunobod tumani",
      "Sardoba tumani",
      "Sirdaryo tumani",
      "Xovos tumani",
    ],
  },
  "Qoraqalpog'iston Respublikasi": {
    cities: ["Nukus shahri"],
    districts: [
      "Amudaryo tumani",
      "Beruniy tumani",
      "Bo'zatov tumani",
      "Chimboy tumani",
      "Ellikqal'a tumani",
      "Kegeyli tumani",
      "Mo'ynoq tumani",
      "Nukus tumani",
      "Qanliko'l tumani",
      "Qo'ng'irot tumani",
      "Qorao'zak tumani",
      "Shumanay tumani",
      "Taxiatosh tumani",
      "Taxtako'pir tumani",
      "To'rtko'l tumani",
      "Xo'jayli tumani",
    ],
  },
};

export const REGION_NAMES = Object.keys(UZ_REGIONS).sort();

export function getCities(region) {
  return UZ_REGIONS[region]?.cities || [];
}

export function getDistricts(region) {
  return UZ_REGIONS[region]?.districts || [];
}

// Maktablar ro'yxatidan qaysi viloyat/shahar/tumanlarda maktab borligini hisoblash
export function buildAvailability(schools) {
  const regions = new Set();
  const citiesByRegion = {};
  const districtsByRegion = {};

  for (const s of schools || []) {
    if (s.region) {
      regions.add(s.region);
      if (s.city) {
        citiesByRegion[s.region] = citiesByRegion[s.region] || new Set();
        citiesByRegion[s.region].add(s.city);
      }
      if (s.district) {
        districtsByRegion[s.region] = districtsByRegion[s.region] || new Set();
        districtsByRegion[s.region].add(s.district);
      }
    }
  }

  return {
    hasRegion: (r) => regions.has(r),
    hasCity: (r, c) => !!citiesByRegion[r]?.has(c),
    hasDistrict: (r, d) => !!districtsByRegion[r]?.has(d),
  };
}
