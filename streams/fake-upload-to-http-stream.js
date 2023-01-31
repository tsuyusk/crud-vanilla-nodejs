import { Readable } from 'node:stream';

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    // o chunk nunca pode ser um formato primitivo (number, string, ...)
    const i = this.index++

    setTimeout(() => {
      if (i > 5) {
        // push -> metodo para stream fornecer informaçoes pra quem está consumindo
        this.push(null)
      } else {
        // Buffer so le Strings
        const buf = Buffer.from(String(i));
  
        this.push(buf);
      }
    }, 1000)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half'
}).then(response => {
  return response.text();
}).then(data => {
  console.log(data);
});
