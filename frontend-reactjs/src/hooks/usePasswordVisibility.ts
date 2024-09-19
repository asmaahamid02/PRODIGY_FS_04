import { useState } from 'react'

const usePasswordVisibility = () => {
  const [visible, setVisible] = useState(false)

  const toggle = () => setVisible(!visible)

  return { visible, toggle }
}

export default usePasswordVisibility
