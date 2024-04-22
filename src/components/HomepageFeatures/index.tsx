import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Security',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        User transactions are recorded on Ethereum L1 using zk technology, with data availability from Layer 2s verifiable on L1. Strict arbitration ensuring the security of cross-chain messages.
      </>
    ),
  },
  {
    title: 'Efficiency',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Optimistically transmit messages to minimize performance loss and reserve time blocks to ensure message delivery security, while reducing arbitration costs through zero-knowledge proofs.
      </>
    ),
  },
  {
    title: 'Decentralization',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        In the Vizing omni-chain environment, users have the ability to choose between Relayer and Validator to transmit messages. Simultaneously, any developer can easily integrate omni-chain communication functionality through our provided development documentation.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
