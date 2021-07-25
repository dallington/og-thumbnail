import { VercelRequest, VercelResponse } from '@vercel/node'
import puppeteer, { Page } from 'puppeteer-core'
import { getOptions } from './_lib/chromeOptions'
const cloudinary = require('cloudinary').v2
const hash = require('object-hash')

function delay (time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
};

cloudinary.config({
  cloud_name: 'dall-dev',
  api_key: '565891635356186',
  api_secret: 'NfdSs_MBzqxvP_RHt1vCA6GXYpk'
})

const CLOUDINARY_FOLDER = 'og'

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

    console.log(params)

    // Get a unique id for our image based of its params
    const imageId = hash(params)

    // First check to see if its already uploaded to cloudinary
    try {
      const result = await cloudinary.api.resource(`${CLOUDINARY_FOLDER}/${imageId}`)
      console.log('Got existing image')
      return response.redirect(301, result.secure_url)
    } catch (e) {
    // No existing image
      console.log('No existing image')
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
    // const file = await page.screenshot({ type: 'png' })
    const base64 = await page.screenshot({ encoding: 'base64' })
    const image = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      {
        public_id: imageId,
        folder: CLOUDINARY_FOLDER
      }
    )

    return response.redirect(301, image.secure_url)
    /* // await page.close()

    // response.send(`<img src="data:image/png;base64, ${imageBuffer.toString('base64')}" />`)

    // const file = await getScreenshot(html, isDev)

    response.statusCode = 200

    response.setHeader('Content-Type', 'image/png')
    response.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    )

    response.end(file) */
  } catch (e) {
    response.statusCode = 500
    response.setHeader('Content-Type', 'text/html')
    response.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(e)
  }

  // response.status(200).send(`Hello ${name}!`)
}

export default generatePreview
