import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase, Menu, MenuItem, Button, Select, FormControl, InputLabel, Chip } from "@mui/material";
import { AccountCircle, Search, Tune, ArrowDropDown } from "@mui/icons-material";

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '28px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  maxWidth: '680px',
  transition: 'all 0.3s ease',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(4),
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

const FiltrosContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  marginLeft: theme.spacing(1),
}));

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const [professor, setProfessor] = React.useState('');
  const [disciplina, setDisciplina] = React.useState('');
  const [ano, setAno] = React.useState('');
  const [filtros, setFiltros] = React.useState([]);
  const isMenuOpen = Boolean(anchorEl);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleFilterMenuOpen = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterMenuClose = () => setFilterAnchorEl(null);

  const handleProfessorChange = (event) => setProfessor(event.target.value);
  const handleDisciplinaChange = (event) => setDisciplina(event.target.value);
  const handleAnoChange = (event) => setAno(event.target.value);

  const handleFilterApply = () => {
    const novosFiltros = [];
    if (professor) novosFiltros.push(`Professor: ${professor}`);
    if (disciplina) novosFiltros.push(`Disciplina: ${disciplina}`);
    if (ano) novosFiltros.push(`Ano: ${ano}`);
    setFiltros(novosFiltros);
    handleFilterMenuClose();
  };

  const handleDeleteFiltro = (filtroToDelete) => () => {
    setFiltros(filtros.filter((filtro) => filtro !== filtroToDelete));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
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
              color: '#fff'
            }}
          >
            UniQuest
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchContainer>
              <SearchIconWrapper>
                <Search sx={{ color: '#888' }} />
              </SearchIconWrapper>

              <FiltrosContainer>
                {filtros.map((filtro, index) => (
                  <Chip
                    key={index}
                    label={filtro}
                    onDelete={handleDeleteFiltro(filtro)}
                    sx={{ 
                      backgroundColor: alpha('#fff', 0.1), 
                      color: '#fff',
                    }}
                  />
                ))}
              </FiltrosContainer>

              <StyledInputBase
                placeholder={filtros.length === 0 ? "Buscar provas, matérias ou usuários..." : ""}
                inputProps={{ 'aria-label': 'search' }}
                sx={{ color: '#fff', flexGrow: 1 }}
              />

              <IconButton
                size="large"
                color="inherit"
                onClick={handleFilterMenuOpen}
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
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
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          sx={{ 
            '& .MuiPaper-root': {
              backgroundColor: '#2A2A2A',
              color: '#fff',
              minWidth: '200px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
            Meu Perfil
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
            Configurações
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
            Sair
          </MenuItem>
        </Menu>
        
        <Menu
          anchorEl={filterAnchorEl}
          open={isFilterMenuOpen}
          onClose={handleFilterMenuClose}
          sx={{ 
            '& .MuiPaper-root': {
              background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
              color: '#fff',
              minWidth: '300px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              padding: '16px',
            }
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="professor-label" sx={{ color: '#fff' }}>Professor</InputLabel>
            <Select
              labelId="professor-label"
              value={professor}
              onChange={handleProfessorChange}
              label="Professor"
              IconComponent={ArrowDropDown}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="Igor Valente">Prof. Igor Valente</MenuItem>
              <MenuItem value="Adriano Blue">Prof. Adriano Blue</MenuItem>
              <MenuItem value="Marcos Cirineu">Prof. Marcos Cirineu</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="disciplina-label" sx={{ color: '#fff' }}>Disciplina</InputLabel>
            <Select
              labelId="disciplina-label"
              value={disciplina}
              onChange={handleDisciplinaChange}
              label="Disciplina"
              IconComponent={ArrowDropDown}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="POO">Programação Orientada a Objetos (POO)</MenuItem>
              <MenuItem value="PLIN">Programação Linear (PLIN)</MenuItem>
              <MenuItem value="PEST">Probabilidade e Estatística (PEST)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="ano-label" sx={{ color: '#fff' }}>Ano</InputLabel>
            <Select
              labelId="ano-label"
              value={ano}
              onChange={handleAnoChange}
              label="Ano"
              IconComponent={ArrowDropDown}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
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