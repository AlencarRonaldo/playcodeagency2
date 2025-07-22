interface SEOProps {
  structuredData: object
  children?: React.ReactNode
}

export default function SEOComponent({ structuredData, children }: SEOProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {children}
    </>
  )
}