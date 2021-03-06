import { getHours, isBefore, startOfHour, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationRepositories from '@modules/notifications/repositories/INotificationsRepository';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';


interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
};

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepositories,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
    ){};


  public async execute({ date, provider_id,user_id}: IRequestDTO): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date")
    }

    if ( user_id === provider_id ) {
      throw new AppError ("You can't create an appointment with yourself")
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can only create appointments between 8am and 5pm")
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInSameDate) {
      throw new AppError ('This appointment is already booked')
    }

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h");

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`
    })


    await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d'
    )}`)

    return appointment;
  };
};

export default CreateAppointmentService;
