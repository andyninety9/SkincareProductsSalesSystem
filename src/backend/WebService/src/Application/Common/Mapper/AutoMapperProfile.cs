using Application.Features.Users.Response;
using Application.Users.Commands;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            CreateMap<GetMeResponse, User>();
            CreateMap<User, GetMeResponse>();
            CreateMap<User, GetAllUsersResponse>();
            CreateMap<GetAllUsersResponse, User>();
            
            CreateMap<User, GetAllUsersResponse>()
           .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Usr.Role.RoleId)) 
           .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.Usr.AccStatusId)) 
           .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Usr.Username)) 
           .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => MapGender(src.Gender))) 
           .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Dob.HasValue ? src.Dob.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null)) // Ánh xạ Dob
           .ForMember(dest => dest.RewardRank, opt => opt.MapFrom(src => MapRewardRank(src.RewardPoint))); 
        }

        private static string MapGender(short? gender)
        {
            return gender switch
            {
                1 => "Male",
                2 => "Female",
                _ => "Other"
            };
        }

        private static string MapRewardRank(short rewardPoint)
        {
            return rewardPoint switch
            {
                < 250 => "Bronze",
                >= 250 and < 1500 => "Silver",
                _ => "Gold"
            };
        }

    }
}