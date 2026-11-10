import React from 'react'
import Cards from './Cards'

const Dashboard = () => {


const cards = {
data: [
  {
    icon: '📦',
    title: 'Used Space',
    value: '49/50 GB',
    footerText: 'Get More Space...',
    footerIcon: '⚠️',
    color: 'bg-orange-500'
  },
 
  
]
}

 return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
      {cards.data.map((card, index) => (
        <Cards
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
          footerText={card.footerText}
          footerIcon={card.footerIcon}
          color={card.color}
        />
      ))}
    </div>
    </>
  )
}

export default Dashboard