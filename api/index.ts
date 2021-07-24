import { VercelRequest, VercelResponse } from '@vercel/node'

const puppeteer = require('puppeteer')

function delay (time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
};

type TypeString = (string | string[]);

type TypeParams = {
  title: TypeString,
  authorName?: TypeString,
  authorImage?: TypeString,
  date?: TypeString,
  color?: TypeString
}
const generatePreview = async (request: VercelRequest, response: VercelResponse) => {
  const params:TypeParams = {
    title: request.query.title,
    authorName: request.query.authorName,
    authorImage: request.query.authorImage,
    date: request.query.date,
    color: request.query.color
  }

  // Spawn a new headless browser
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 1600,
    height: 800
  })

  const url = new URL('https://og-thumbnail.vercel.app/OpenGraph')
  Object.keys(params)
    .forEach((key) => {
      const KeyValue = params[key as keyof TypeParams]
      if (KeyValue) {
        url.searchParams.set(key, KeyValue as any)
      }
    })

  await page.goto(url.toString(), { waitUntil: 'domcontentloaded' })
  await delay(1000)
  const imageBuffer = await page.screenshot()
  await browser.close()

  response.send(`<img src="data:image/png;base64, ${imageBuffer.toString('base64')}" />`)

  // response.status(200).send(`Hello ${name}!`)
}

export default generatePreview
