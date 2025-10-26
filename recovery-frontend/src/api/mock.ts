import type { IPaginatedStrategies } from "../types/index";

export const STRATEGIES_MOCK: IPaginatedStrategies = {
  total: 5,
  items: [
    {
      id: 1,
      title: "Полное восстановление из резервной копии",
      description: "Стратегия предполагает полное восстановление системы из последней резервной копии. Подходит для критических систем с регулярным резервным копированием. Время восстановления зависит от объема данных и скорости сети.",
      image_url: "http://localhost:9000/strategies/Images/full-backup.png",
      status: "active",
      base_recovery_hours: 4.0,
    },
    {
      id: 2,
      title: "Инкрементное восстановление",
      description: "Восстановление данных с использованием инкрементных резервных копий. Более быстрый метод для систем с частыми изменениями. Позволяет восстановить систему до определенной точки времени.",
      image_url: "http://localhost:9000/strategies/Images/incremental.png",
      status: "active",
      base_recovery_hours: 2.5,
    },
    {
      id: 3,
      title: "Репликация в реальном времени",
      description: "Использование реплики системы для мгновенного переключения. Минимальное время простоя. Подходит для высоконагруженных систем с требованиями к непрерывности работы.",
      image_url: "http://localhost:9000/strategies/Images/replication.png",
      status: "active",
      base_recovery_hours: 0.5,
    },
    {
      id: 4,
      title: "Восстановление из снимков виртуальных машин",
      description: "Быстрое восстановление виртуализированных систем из снимков (snapshots). Эффективно для облачных инфраструктур и виртуальных сред.",
      image_url: "http://localhost:9000/strategies/Images/vm-snapshot.png",
      status: "active",
      base_recovery_hours: 1.5,
    },
    {
      id: 5,
      title: "Горячий резерв (Hot Standby)",
      description: "Постоянно работающая резервная система, готовая к немедленному переключению. Нулевое время восстановления. Требует дублирования инфраструктуры.",
      image_url: "http://localhost:9000/strategies/Images/hot-standby.png",
      status: "active",
      base_recovery_hours: 0.1,
    },
  ],
};
