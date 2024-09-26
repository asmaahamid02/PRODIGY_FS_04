const Spinner = ({ size = 'loading-lg' }: { size?: string }) => {
  return (
    <div className={`flex justify-center items-center`}>
      <span className={`loading loading-ring  ${size}`}></span>
    </div>
  )
}

export default Spinner
