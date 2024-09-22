const Spinner = ({ size = 'h-16' }: { size?: string }) => {
  return (
    <div className={`flex justify-center items-center ${size}`}>
      <span className='loading loading-ring loading-lg'></span>
    </div>
  )
}

export default Spinner
