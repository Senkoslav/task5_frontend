interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inline?: boolean;
}

export default function Loader({ text, size = 'md', className = '', inline = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  if (inline) {
    return (
      <div className={`d-flex align-items-center ${className}`}>
        <div className={`spinner-border ${sizeClasses[size]}`} role="status">
          <span className="visually-hidden">Loading</span>
        </div>
        {text && (
          <span className="ms-2">{text}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      <div className={`spinner-border ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading</span>
      </div>
      {text && (
        <p className="mt-2 mb-0 text-muted">{text}</p>
      )}
    </div>
  );
}
