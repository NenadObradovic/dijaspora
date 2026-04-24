import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md bg-red-100 p-4 text-center text-red-800">
          {this.props.errorMessage}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
