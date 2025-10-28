import logoImage from '../../public/logo3.png';

interface AIOrbProps {
  size?: "sm" | "md" | "lg";
}

export function AIOrb({ size = "md" }: AIOrbProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <img 
        src={logoImage} 
        alt="Achroweb Solutions Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
