import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51TQdXVQpj7YmnPkqb50yTvwgkNCvK5P2p44M4KoKUtTfPhWNDgZKRJYG3ubEZskbl2d57njkVHOB2hDdVvTq3sfc00TX2dTonX')

async function setup() {
  console.log('Creating plans...')
  const proPlan = await stripe.products.create({
    name: 'Pro',
    description: 'Professional portfolio with custom domain and analytics',
  })

  const proPrice = await stripe.prices.create({
    product: proPlan.id,
    unit_amount: 900, 
    currency: 'usd',
    recurring: { interval: 'month' },
  })
  const businessPlan = await stripe.products.create({
    name: 'Business',
    description: 'Everything in Pro plus AI features and booking system',
  })

  const businessPrice = await stripe.prices.create({
    product: businessPlan.id,
    unit_amount: 1900, 
    currency: 'usd',
    recurring: { interval: 'month' },
  })
}

setup()