import { Database } from './database.js';
import { buildRoutePath } from './utils/buildRoutePath.js';

const db = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query
      
      const data = db.select('users', {
        name: search,
        email: search
      })

      return res
        .writeHead(200)
        .end(
          JSON.stringify(data)
        );
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body;

      const user = {
        name,
        email
      };

      db.insert('users', user);
      return res
        .writeHead(201)
        .end(
          JSON.stringify(user)
        );
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      const user = db.update('users', id, { name, email })

      return res.end(
        JSON.stringify(user)
      )
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      db.delete('users', id)

      return res.writeHead(204).end()
    }
  }
];

