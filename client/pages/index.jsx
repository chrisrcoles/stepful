import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <Head>
        <title>Overview</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <p className="text-lg mb-4">Welcome to the Stepful full-stack take home challenge assessment solution!</p>
      <p className="text-lg mb-4">
        Please head over to <Link href="/dashboard/coaches"><a className="underline text-blue-600">Coaches Dashboard</a></Link> to get started
      </p>
      <p className="text-lg mb-4">
        Please head over to <Link href="/dashboard/students"><a className="underline text-blue-600">Students Dashboard</a></Link> to get started
      </p>
    </div>
  );
}
