import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.dataSourcePath = "../../../data/data20210322/"

  config.cluster = {
    listen: {
      port: 7007,
      hostname: '127.0.0.1',
    }
  }

  return config;
};
