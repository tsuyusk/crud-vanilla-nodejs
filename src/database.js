import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const databasePath = new URL('./db/db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data);
      })
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(
      databasePath,
      JSON.stringify(this.#database)
    )
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data
  }

  insert(table, data) {
    Object.assign(data, { id: randomUUID() })

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    
    this.#persist();
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id) ?? -1

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }

    return this.#database[table][rowIndex]
  }

  delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id) ?? -1

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}