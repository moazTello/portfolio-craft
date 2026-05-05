import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51TQdXVQpj7YmnPkqb50yTvwgkNCvK5P2p44M4KoKUtTfPhWNDgZKRJYG3ubEZskbl2d57njkVHOB2hDdVvTq3sfc00TX2dTonX')

async function setup() {
  // Free Plan
  console.log('Creating plans...')

  // Pro Plan
  const proPlan = await stripe.products.create({
    name: 'Pro',
    description: 'Professional portfolio with custom domain and analytics',
  })

  const proPrice = await stripe.prices.create({
    product: proPlan.id,
    unit_amount: 900, // $9/month
    currency: 'usd',
    recurring: { interval: 'month' },
  })

  // Business Plan
  const businessPlan = await stripe.products.create({
    name: 'Business',
    description: 'Everything in Pro plus AI features and booking system',
  })

  const businessPrice = await stripe.prices.create({
    product: businessPlan.id,
    unit_amount: 1900, // $19/month
    currency: 'usd',
    recurring: { interval: 'month' },
  })

  console.log('✅ Pro Price ID:', proPrice.id)
  console.log('✅ Business Price ID:', businessPrice.id)
  console.log('Add these to your .env!')
}

setup()