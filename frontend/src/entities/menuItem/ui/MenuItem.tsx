type TMenuItemProps = {
  id: number | string;
  title: string;  
  subtitle: string;
  onClick: () => void;
  description: string; 
}

export const MenuItem = (props: TMenuItemProps) => {
  const {title, subtitle, onClick, description} = props

  return (
    <div
      onClick={onClick}
      className="border-b border-white/10 pb-3 pt-3" >
      {title && <div className="font-semibold text-white">{title}</div>}
      {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
      <div className="text-sm opacity-85">{description}</div>
    </div>
  )
}
