const { PrismaPg } = require('@prisma/adapter-pg')

/** @type {import('prisma').PrismaConfig} */
const config = {
  earlyAccess: true,
  migrate: {
    async adapter() {
      return new PrismaPg({ 
        connectionString: process.env.DATABASE_URL 
      })
    },
  },
}

module.exports = config