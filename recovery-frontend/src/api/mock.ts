import type { IPaginatedStrategies } from "../types/index";

export const STRATEGIES_MOCK: IPaginatedStrategies = {
  total: 5,
  items: [
    {
      id: 1,
      title: "Backup & Recovery",
      description: "Самая распространенная стратегия. Предлагает регулярное создание копий данных и их сохранение на другом носителе или в другом месте. В случае сбоя данные восстанавливаются из резервной копии.",
      image_url: "http://localhost:9000/recovery-images/backup.png",
      status: "active",
      base_recovery_hours: 8.0,
    },
    {
      id: 2,
      title: "Репликация",
      description: "Репликация данных — это процесс создания и поддержания нескольких копий одних и тех же данных в разных местах или на разных серверах.",
      image_url: "http://localhost:9000/recovery-images/replication.png",
      status: "active",
      base_recovery_hours: 1.0,
    },
    {
      id: 3,
      title: "Горячий резерв (Hot Standby)",
      description: "Горячий резерв предполагает наличие полностью дублирующей инфраструктуры, которая работает параллельно с основной. При сбое переключение на резервную происходит моментально или очень быстро.",
      image_url: "http://localhost:9000/recovery-images/hot_reserve.png",
      status: "active",
      base_recovery_hours: 0.1,
    },
    {
      id: 4,
      title: "Теплый резерв",
      description: "Теплый резерв — это компромисс между горячим и холодным резервом. Инфраструктура частично загружена и способна активироваться в течение короткого времени.",
      image_url: "http://localhost:9000/recovery-images/warm_reserve.png",
      status: "active",
      base_recovery_hours: 4.0,
    },
    {
      id: 5,
      title: "Холодный резерв",
      description: "Холодный резерв — это наличие резервной инфраструктуры, которая выключена и требует ручного запуска и настройки.",
      image_url: "http://localhost:9000/recovery-images/cold_reserve.png",
      status: "active",
      base_recovery_hours: 24.0,
    },
  ],
};
