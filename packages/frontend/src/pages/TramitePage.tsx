import React from 'react'
import { useParams } from 'react-router-dom'
import ClientQueue from '../components/ClientQueue'

const TramitePage: React.FC = () => {
  const { tramiteNumber } = useParams<{ tramiteNumber: string }>()

  return (
    <ClientQueue tramiteNumber={tramiteNumber || ''} />
  )
}

export default TramitePage
