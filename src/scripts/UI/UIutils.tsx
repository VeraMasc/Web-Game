import * as React from 'react';

/**Catches react errors */
export class ErrorBoundary extends React.Component {
    declare state:{ hasError?:boolean}
    declare props:Readonly<{fallback?, children?}>

    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return this.props.fallback ?? <p><b>Error with no fallback!</b></p>;
      }
  
      return this.props.children;
    }
  }