import { VercelRequest, VercelResponse } from '@vercel/node'
import puppeteer, { Page } from 'puppeteer-core'
import { getOptions } from './_lib/chromeOptions'

function delay (time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
};

let _page: Page | null

async function getPage (isDev: boolean): Promise<Page> {
  if (_page) {
    return _page
  }

  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)

  _page = await browser.newPage()

  return _page
}

type TypeString = (string | string[]);

type TypeParams = {
  title: TypeString,
  authorName?: TypeString,
  authorImage?: TypeString,
  date?: TypeString,
  color?: TypeString
}
const generatePreview = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const params:TypeParams = {
      title: request.query.title,
      authorName: request.query.authorName,
      authorImage: request.query.authorImage,
      date: request.query.date,
      color: request.query.color
    }

    // Spawn a new headless browser
    const page = await getPage(false)

    await page.setViewport({ width: 1200, height: 800 })
    await page.evaluateHandle('document.fonts.ready')

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
    const file = await page.screenshot({ type: 'png' })
    // await page.close()

    // response.send(`<img src="data:image/png;base64, ${imageBuffer.toString('base64')}" />`)

    // const file = await getScreenshot(html, isDev)

    response.statusCode = 200

    response.setHeader('Content-Type', 'image/png')
    response.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    )

    response.end(file)
  } catch (e) {
    response.statusCode = 500
    response.setHeader('Content-Type', 'text/html')
    response.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(e)
  }

  // response.status(200).send(`Hello ${name}!`)
}

export default generatePreview
