const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const PORT = process.env.PORT || 8000

app.use(jsonParser)
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
const VONAGE_API_KEY = '2b299711'
const VONAGE_API_SECRET = 's8C8Ykaeq9VfUaLm'
const IP2LOCATION_API_KEY = 'c27ed90a798749ab9716fd439b18ebe0'
const SCAMALYTICS_API_KEY =
  '01aac519edb0a33c5f6ee74d7ae168d4338dd4f0b902a416c9bcb318d9d87e33'
const GOLOGIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjY0ODdjNmM0YjZjMWJjNWFkYTJjMjA3NCIsInR5cGUiOiJ1c2VyIiwic3ViIjoiNjQ4NjVjMTM4YTk0OGQwNDIwNjI0MTU0In0.GyPY43OaO8rWzv1j6enQgiE4sSrymOJARLcPWoKI-uY'

app.post('/verify-phone', async (req, res) => {
  const { phone } = req.body
  console.log(phone)
  try {
    const response = await axios.get(
      `https://api.nexmo.com/verify/json?&api_key=${VONAGE_API_KEY}&api_secret=${VONAGE_API_SECRET}&number=${phone}&brand=AcmeInc`
    )
    console.log(response.data)
    if (response.data.status === '0') {
      return res.status(200).json({
        success: true,
        message: 'Success',
        data: response.data,
      })
    } else {
      return res.status(200).json({
        success: true,
        message: response.data.error_text,
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Phone Verify Error',
    })
  }
})

app.post('/verify-code', async (req, res) => {
  const { code, requestId } = req.body
  console.log(code, requestId)
  try {
    const response = await axios.get(
      `https://api.nexmo.com/verify/check/json?&api_key=${VONAGE_API_KEY}&api_secret=${VONAGE_API_SECRET}&request_id=${requestId}&code=${code}`
    )
    console.log(response.data)
    if (response.data.status === '0') {
      return res.status(200).json({
        success: true,
        message: 'Success',
        data: response.data,
      })
    } else {
      return res.status(200).json({
        success: true,
        message: response.data.error_text,
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Phone Verify Error',
    })
  }
})

app.post('/proxy', async (req, res) => {
  const { host, username, password, port } = req.body
  const payload = {
    host: host,
    mode: 'http',
    password: password,
    port: port === '32325' ? '12321' : port,
    type: 'http',
    username: username,
  }
  console.log(payload)
  try {
    const response = await axios.post(
      'https://api.gologin.com/browser/check_proxy',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + GOLOGIN_TOKEN,
        },
      }
    )
    return res.status(200).json({
      success: true,
      data: response.data,
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/ip-location', async (req, res) => {
  const { ip } = req.body

  try {
    const response = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${IP2LOCATION_API_KEY}&ip=${ip}`
    )
    return res.status(200).json({
      success: true,
      message: 'Success',
      location: response.data,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ip Location Error',
    })
  }
})

app.post('/scamalytics-ip', async (req, res) => {
  const { ip } = req.body

  try {
    const response = await axios.post(
      `https://api12.scamalytics.com/rambido/?key=${SCAMALYTICS_API_KEY}&ip=${ip}`
    )
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: response.data,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Scamalytics IP Check Error',
    })
  }
})

app.post('/verify-token', async (req, res) => {
  const { reCAPTCHA_TOKEN, Secret_Key } = req.body

  try {
    let response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Secret_Key}&response=${reCAPTCHA_TOKEN}`
    )
    return res.status(200).json({
      success: true,
      message: 'Token successfully verified',
      verification_info: response.data,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying token',
    })
  }
})

app.listen(PORT, () => console.log(`App started on port ${PORT}`))
