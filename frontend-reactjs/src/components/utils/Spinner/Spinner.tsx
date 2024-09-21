const Spinner = ({ size }: { size: string }) => {
  return (
    <div className={`flex justify-center items-center ${size}`}>
      <span className='loading loading-ring loading-lg'></span>
    </div>
  )
}

//default props
Spinner.defaultProps = {
  size: 'h-16',
}

export default Spinner
