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
        }
        
    }
}