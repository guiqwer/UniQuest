import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase, Menu, MenuItem, Button, Select, FormControl, InputLabel, Chip } from "@mui/material";
import { AccountCircle, Search, Tune } from "@mui/icons-material";
import ProfileModal from './ProfileModal';
import { useState } from 'react';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '28px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  width: '100%',
  maxWidth: '680px',
  transition: 'all 0.3s ease',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: '60px',
  border: '1px solid #e0e0e0'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    fontSize: '0.9rem',
  },
}));

const FiltersContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  position: 'absolute',
  right: '56px',
  top: '50%',
  transform: 'translateY(-50%)'
}));

export default function NavBar({ navigate }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const [professor, setProfessor] = React.useState('');
  const [disciplina, setDisciplina] = React.useState('');
  const [ano, setAno] = React.useState('');
  const [filters, setFilters] = React.useState([]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleMenuClose();
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleFilterMenuOpen = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterMenuClose = () => setFilterAnchorEl(null);

  const handleProfessorChange = (event) => setProfessor(event.target.value);
  const handleDisciplinaChange = (event) => setDisciplina(event.target.value);
  const handleAnoChange = (event) => setAno(event.target.value);

  const handleFilterApply = () => {
    const newFilters = [];
    if (professor) newFilters.push(`Professor: ${professor}`);
    if (disciplina) newFilters.push(`Disciplina: ${disciplina}`);
    if (ano) newFilters.push(`Ano: ${ano}`);
    setFilters(newFilters);
    handleFilterMenuClose();
  };

  const handleDeleteFilter = (filterToDelete) => () => {
    setFilters(filters.filter((filter) => filter !== filterToDelete));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#fff',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Toolbar sx={{ minHeight: '72px!important', padding: '0 24px!important' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              mr: 2,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => navigate("feed")}
          >
            UniQuest
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchContainer>
              <SearchIconWrapper>
                <Search sx={{ color: '#888' }} />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder={filters.length === 0 ? "Buscar provas, matérias ou usuários..." : ""}
                inputProps={{ 'aria-label': 'search' }}
                sx={{ color: '#333', flexGrow: 1 }}
              />

              <FiltersContainer>
                {filters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter}
                    onDelete={handleDeleteFilter(filter)}
                    sx={{ 
                      backgroundColor: '#d3d3d3',
                      color: '#333',
                      '& .MuiChip-deleteIcon': {
                        color: '#666'
                      }
                    }}
                  />
                ))}
              </FiltersContainer>

              <IconButton
                size="large"
                color="inherit"
                onClick={handleFilterMenuOpen}
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#333',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Tune sx={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </SearchContainer>
          </Box>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ 
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ 
            '& .MuiPaper-root': {
              backgroundColor: '#fff',
              color: '#333',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <MenuItem onClick={handleOpenProfile} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
            Perfil
          </MenuItem>
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              sessionStorage.removeItem("token"); 
              navigate("login"); 
            }} 
            sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
          >
            Sair
          </MenuItem>
        </Menu>
        
        <ProfileModal openModal={openProfile} handleCloseModal={handleCloseProfile} />

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterMenuClose}
          sx={{ 
            '& .MuiPaper-root': {
              backgroundColor: '#fff',
              color: '#333',
              minWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '16px',
            }
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="professor-label">Professor</InputLabel>
            <Select
              labelId="professor-label"
              value={professor}
              onChange={handleProfessorChange}
              label="Professor"
              sx={{ 
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0'
                }
              }}
            >
              <MenuItem value="Igor Valente">Prof. Igor Valente</MenuItem>
              <MenuItem value="Adriano Blue">Prof. Adriano Blue</MenuItem>
              <MenuItem value="Marcos Cirineu">Prof. Marcos Cirineu</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="disciplina-label">Disciplina</InputLabel>
            <Select
              labelId="disciplina-label"
              value={disciplina}
              onChange={handleDisciplinaChange}
              label="Disciplina"
              sx={{ 
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0'
                }
              }}
            >
              <MenuItem value="POO">Programação Orientada a Objetos (POO)</MenuItem>
              <MenuItem value="PLIN">Programação Linear (PLIN)</MenuItem>
              <MenuItem value="PEST">Probabilidade e Estatística (PEST)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="ano-label">Ano</InputLabel>
            <Select
              labelId="ano-label"
              value={ano}
              onChange={handleAnoChange}
              label="Ano"
              sx={{ 
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0'
                }
              }}
            >
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleFilterApply}
              sx={{ 
                backgroundColor: '#2e7d32',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1B5E20',
                }
              }}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </Menu>
      </AppBar>
    </Box>
  );
}