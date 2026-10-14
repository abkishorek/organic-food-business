import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

/** Header lockup: the supplied logo (if set) beside a Kannada + English wordmark. */
export default function Brand() {
  const { brand, logo } = siteConfig;
  return (
    <Link to="/" className="brand" aria-label={`${brand.nameEnglish}, home`}>
      {logo && <img className="brand__logo" src={logo} alt="" width={52} height={52} />}
      <span className="brand__kn" lang="kn">
        {brand.nameKannada}
      </span>
      <span className="brand__en">{brand.nameEnglish}</span>
    </Link>
  );
}
