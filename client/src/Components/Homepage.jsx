import React from 'react'
import Navbar from './Navbar'
import Addinvoice from '../Invoce/Addinvoice'
import Footer from './Footer'
import Section from './Section'
import Features from './Features'
import InvoiceGeneratorForm from './InvoiceGeneratorForm'
import InvoiceFormats from './InvoiceFormats'
import InvoiceTemplateSelector from './InvoiceTemplateSelector'

const Homepage = () => {
  return (
    <>

      <Navbar />
      <main className="min-h-screen bg-gray-100 font-sans">
        <Section />
        <InvoiceFormats/>
        <InvoiceTemplateSelector/>
        {/* <InvoiceGeneratorForm/> */}
        <Features/>
        <section className="pt-8">
          <Footer />
          {/* <Addinvoice /> */}
        </section>
      </main>
    </>
  )
}

export default Homepage
