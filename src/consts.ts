/**
 * Globals definition
 */

export const MYSQL_DB = {
  HOST     : 'localhost',
  PORT     :  3306,
  USER     : 'tibuser',
  PASSWORD : 'pKalM24Nas',
  DATABASE : 'tibia'
}

export const sessionCookieName = 'gsession';

export const defaultCharacter = {
  maleOutfitId: 128,
  femaleOutfitId: 136,

  lookHead: 78,
  lookBody: 69,
  lookLegs: 58,
  lookFeet: 76,

  vocation: 0,
  level: 1,
  health: 150,
  mana: 0,
  cap: 400,

  town: 11,
  pos: {
    x: 32097,
    y: 32219,
    z: 7,
  }
};

export const vocations = [
  'No vocation',
  'Mage',
  'Paladin',
  'Knight',
  'Elder Mage',
  'Royal Paladin',
  'Elite Knight',
  'Sage',
  'Templar',
  'Guardian',
  'Elder Sage',
  'Royal Templar',
  'Elite Guardian',
];