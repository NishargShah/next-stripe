import { GetServerSideProps } from 'next'
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
// import { createCheckoutSession } from '../../client'
import { createCheckoutSession } from '../dist/client'

interface Prices {
  prices: []
}

export default ({ prices }: Prices) => {
  const onClick = async (priceId: string) => {
    console.log(priceId)
    const session = await createCheckoutSession({
      success_url: 'https://w68zm.sse.codesandbox.io/',
      cancel_url: 'https://w68zm.sse.codesandbox.io/',
      line_items: [{ price: 'price_1Ig3W7SBxImHEA9O74SMNCR6', quantity: 1 }],
      payment_method_types: ['card'],
      mode: 'subscription'
    })
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    )
    console.log(stripe)
    if (stripe) {
      console.log('ddd')
      try {
        await stripe.redirectToCheckout({
          sessionId: session.id
        })
      } catch (e) {
        console.log(e)
      }
      console.log('why')
    }
  }

  return (
    <div>
      <h1>Programmer For Hire</h1>

      <ul>
        {prices.map(
          (price: {
            id: string
            product: {
              name: string
              images: string[]
            }
            unit_amount: number
          }) => (
            <li key={price.id}>
              <h2>{price.product.name}</h2>
              <img src={price.product.images[0]} alt="product" />
              <p>Cost: ${(price.unit_amount / 100).toFixed(2)}</p>
              <button onClick={() => onClick(price.id)}>Buy</button>
            </li>
          )
        )}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2020-08-27'
  })

  const prices = await stripe.prices.list({
    active: true,
    limit: 10,
    expand: ['data.product']
  })

  // const session = await stripe.checkout.sessions.create({
  //   success_url: "https://w68zm.sse.codesandbox.io/",
  //   cancel_url: "https://w68zm.sse.codesandbox.io/",
  //   line_items: [{ price: "price_1Ig3W7SBxImHEA9O74SMNCR6", quantity: 1 }],
  //   payment_method_types: ["card"],
  //   mode: "subscription"
  // });

  // console.log(session);

  return { props: { prices: prices.data } }
}
