import React from 'react'

const Cards = ({ 
  icon = '📦', 
  title = 'Used Space', 
  value = '49/50 GB', 
  footerText = 'Get More Space...', 
  footerIcon = '⚠️', 
  color = 'bg-orange-500'
}) => {
    return (
        <div className="relative bg-white rounded-lg shadow-md p-5 pt-8 w-full max-w-sm mt-3">
            
            {/* Floating Icon Box (Jo card ke upar overlap karega) */}
            <div className={`absolute -top-4 left-5 w-16 h-16 ${color} rounded-lg shadow-lg flex items-center justify-center text-white text-2xl`}>
                {icon}
            </div>

            {/* Top Section: Title & Value (Right Aligned) */}
            <div className="flex flex-col items-end text-right mb-4">
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-100 my-3" />

            {/* Bottom Footer Section */}
            <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>{footerIcon}</span>
                <span className="cursor-pointer hover:underline">{footerText}</span>
            </div>
        </div>
    )
}

export default Cards