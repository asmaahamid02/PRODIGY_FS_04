import { Dispatch, FC, SetStateAction } from 'react'

interface ITabsProps {
  tabs: string[]
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
}

const Tabs: FC<ITabsProps> = ({ tabs, selectedTab, setSelectedTab }) => {
  return (
    <div role='tablist' className='tabs tabs-boxed w-full bg-inherit'>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab font-medium text-lg py-3 h-auto ${
            selectedTab === index ? 'tab-active' : ''
          }`}
          onClick={() => setSelectedTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default Tabs
