// import NextStripe from '../../../../index'
import NextStripe from '../../../dist/index'

export default NextStripe({
  stripe_key: process.env.STRIPE_SECRET_KEY
})
