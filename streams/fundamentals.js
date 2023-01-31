import { Readable, Transform, Writable } from 'node:stream';

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    // o chunk nunca pode ser um formato primitivo (number, string, ...)
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
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

// transforma valores
class InverseNumberPositivityStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

// Writable processa os dados, nao transforma eles
class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    // chunk é o pedaço que está sendo lido ( enviado pelo this.push do Readable )
    
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberPositivityStream())
  .pipe(new MultiplyByTenStream())
