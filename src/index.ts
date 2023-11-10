import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import axios from 'axios'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT || 5003 || 8080
const CHUCK_NORRIS_BASE_URL = 'https://api.chucknorris.io/jokes'
const CHUCK_NORRIS_URLS = {
  random: `${CHUCK_NORRIS_BASE_URL}/random`,
  categories: `${CHUCK_NORRIS_BASE_URL}/categories`,
  search: `${CHUCK_NORRIS_BASE_URL}/search`,
}
app.use(
  cors({
    origin: 'https://chat.openai.com',
  }),
)
app.use(json())
app.get('/', (req, res) => {
  res.status(200).send(`I'm Alive`)
})
app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  res.status(200).send(`Hello ${name}! How are you?`)
})
const fetchJoke = async (url: string, res: any) => {
  try {
    const response = await axios.get(url)
    const joke = response.data.value
    res.json({ joke })
  } catch (error) {
    console.error('Error fetching random Chuck Norris joke:', error)
    res.status(500).send('Error fetching joke')
  }
}
app.get('/chuck-norris/random', async (req, res) => {
  const url = `${CHUCK_NORRIS_URLS.random}`
  await fetchJoke(url, res)
})

app.get('/chuck-norris/joke/:category', async (req, res) => {
  const category = req.params.category
  const url = `${CHUCK_NORRIS_URLS.random}?category=${category}`
  await fetchJoke(url, res)
})

app.get('/chuck-norris/categories', async (_, res) => {
  const url = `${CHUCK_NORRIS_URLS.categories}`
  await fetchJoke(url, res)
})

app.get('/chuck-norris/search', async (req, res) => {
  const query = req.query.query
  const url = `${CHUCK_NORRIS_URLS.search}?query=${query}`
  await fetchJoke(url, res)
})

app.get('/logo.png', async (_, res) => {
  const filename = 'logo.png'
  res.sendFile(filename, { root: '.' })
})

app.get('/.well-known/ai-plugin.json', async (_, res) => {
  fs.readFile('./.well-known/ai-plugin.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error')
      return
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(data)
  })
})

app.get('/openapi.yaml', async (_, res) => {
  fs.readFile('openapi.yaml', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error')
      return
    }
    res.setHeader('Content-Type', 'text/yaml')
    res.status(200).send(data)
  })
})

const main = () => {
  app.listen(PORT as number, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`)
  })
}

main()

