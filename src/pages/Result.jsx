import React from 'react'
import Sidebar from '../components/Sidebar'
import ProgressBar from '../components/ProgressBar'

export default function Result() {
  const raw = localStorage.getItem('rfd_last_result')
  const data = raw ? JSON.parse(raw) : {}

  const {
    candidateName = 'Unknown Candidate',
    fraudScore = 0,
    riskLevel = 'LOW',
    decision = 'ACCEPT',
    highlights = [],
    verification = {}
  } = data

  const riskColor =
    riskLevel === 'HIGH' ? 'text-red-600' :
      riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'

  const decisionColor =
    decision === 'REJECT' ? 'text-red-600' :
      decision === 'MANUAL_REVIEW' ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="min-h-screen p-6 md:flex md:space-x-6">
      <Sidebar />
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Analysis Result</h1>
          <p className="text-gray-500">Detailed result for the uploaded resume</p>
        </div>
        <div className="card max-w-3xl">
          {/* Candidate */}
          <div className="mb-4">
            <div className="text-sm text-gray-500">Candidate</div>
            <div className="text-lg font-semibold">{candidateName}</div>
          </div>

          {/* Fraud Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Fraud Score</div>
                <div className="text-xl font-semibold">{fraudScore}%</div>
              </div>
              <div className="text-sm flex gap-4">
                <span>Risk Level: <span className={`font-medium ${riskColor}`}>{riskLevel}</span></span>
                <span>Decision: <span className={`font-medium ${decisionColor}`}>{decision}</span></span>
              </div>
            </div>
            <div className="mt-3"><ProgressBar value={fraudScore} /></div>
          </div>

          {/* Suspicious Points */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Suspicious Points</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {highlights && highlights.length
                ? highlights.map((h, i) => <li key={i}>{h}</li>)
                : <li>No suspicious points detected</li>}
            </ul>
          </div>

          {/* Verification Details */}
          {Object.keys(verification).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Verification Details</h3>
              <div className="text-sm space-y-1">
                {verification.github && (
                  <div>
                    GitHub:{' '}
                    <span className={verification.github.valid ? 'text-green-600' : 'text-red-500'}>
                      {verification.github.valid
                        ? '✔ Valid account found'
                        : verification.github.found
                          ? '✘ Account invalid or empty'
                          : '✘ No GitHub profile found'}
                    </span>
                  </div>
                )}
                {verification.linkedin && (
                  <div>
                    LinkedIn:{' '}
                    <span className={verification.linkedin.valid ? 'text-green-600' : 'text-red-500'}>
                      {verification.linkedin.valid ? '✔ Profile link detected' : '✘ No LinkedIn profile found'}
                    </span>
                  </div>
                )}
                {verification.contact_info && (
                  <div>
                    Contact:{' '}
                    <span className={
                      verification.contact_info.email_valid && verification.contact_info.phone_valid
                        ? 'text-green-600' : 'text-yellow-600'
                    }>
                      {verification.contact_info.email_valid ? '✔ Email' : '✘ Email missing'}{' '}
                      | {verification.contact_info.phone_valid ? '✔ Phone' : '✘ Phone missing'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
