import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import '../css/tailwind.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Head>
          <title>Ledis</title>
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    )
  }
}

export default MyApp