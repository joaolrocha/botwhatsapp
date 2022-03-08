import { Message } from "whatsapp-web.js";

interface IUser {
  phone: number;
  maxTry: number;
  currentTry: number;
  confirmedLetters: string[];
  wrongLetters: string[];
  word: string;
}

const users: IUser[] = [];

function findUser(phone: number): IUser {
  let user = users.find((u) => u.phone === phone);
  if (!user) {
    const word = "CERVEJA";
    const newUser = {
      phone,
      confirmedLetters: [],
      wrongLetters: [],
      word,
      maxTry: 5,
      currentTry: 0,
    };
    users.push(newUser);
    user = newUser;
  }
  return user;
}

export default function Menssage(msg: Message) {
  const phone = Number(msg.author.replace("@c.us", ""));
  const user = findUser(phone); //indentificando o usuario
  const userIndex = users.findIndex((u) => u.phone === phone);
  console.log({ users, user });
  const letter = msg.body.toLocaleUpperCase();

  let headMensage = "";

  if (letter === user.word) {
    return msg.reply(`Você acertou, a palavra era ${letter}`);
  }

  //Se ja tiver usado a letra
  if (
    user.confirmedLetters.includes(letter) ||
    user.wrongLetters.includes(letter)
  ) {
    headMensage = "Essa palavra ja foi utilizada, tente outra.";
  }
  //Se a letra existir
  else if (user.word.includes(letter)) {
    user.word
      .split("")
      .forEach(
        (wLetter) =>
          wLetter === letter && users[userIndex].confirmedLetters.push(letter)
      );
    headMensage = `Você acertou! a letra ${letter} existe!`;

    if (
      user.word.split("").sort().toString() ===
      user.confirmedLetters.sort().toString()
    ) {
      headMensage = `Você Venceu! a palavra é ${user.word}!`;
      users.splice(userIndex, 1);
    }
  }
  //Se errar
  else {
    users[userIndex].currentTry = users[userIndex].currentTry + 1;
    users[userIndex].wrongLetters.push(letter);
    headMensage = `Você errou! a letra ${letter} não existe!`;
    if (user.currentTry > user.maxTry) {
      users.splice(userIndex, 1);
      headMensage = `Você perdeu! a palavra era ${user.word}`;
    }
  }

  return msg.reply(`
  ${headMensage}

  A palavra possui ${user.word.length} letras.
  Faltam ${user.word.length - user.confirmedLetters.length} letras.
  Tentativas *corretas*: ${user.confirmedLetters.map((l) => l)}
  Tentativas *incorretas*: ${user.wrongLetters.map((l) => l)}

  \`\`\`
  ___________
  |     |
  |     ${user.currentTry > 0 ? "O" : ""}
  |    ${user.currentTry > 2 ? "—" : " "}${user.currentTry > 1 ? "|" : ""}${
    user.currentTry > 3 ? "—" : ""
  }
  |    ${user.currentTry > 4 ? "/" : ""} ${user.currentTry > 5 ? "\\" : ""}
  |
  ============

  Qual a proxima letra?
  \`\`\``);
}
