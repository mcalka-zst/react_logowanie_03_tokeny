const bcrypt = require("bcrypt");

const p1 = 'tajne';
const p2 = 'tajne';

const check = async (p) => {
  const h = await bcrypt.hash(p, 10);
  console.log(`Hasło: ${p} - jego hash: ${h}`)
  await compare(p, h);
};

const compare = async (p, h) => {

  if (await bcrypt.compare(p, h)) console.log("Hasło pasuje do hasha");
  else console.log("Hasło nie pasuje do hasha");
  
};

check(p1);
check(p2);
