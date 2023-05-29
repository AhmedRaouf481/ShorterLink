import * as React from 'react';
import { useEffect, useState } from 'react';
import { style } from '../global/style';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {
  Alert,
  Box,
  Button,
  Container,
  FormGroup,
  LinearProgress,
  List, ListItem,
  ListItemText, Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import axios from '../global/API';


interface Data {
  slug?: string;
  web?: string;
  ios: {
    primary?: string;
    fallback?: string;
  };
  android: {
    primary?: string;
    fallback?: string;
  }
}

function Home() {
  const [slug, setSlug] = useState('');
  const [iosPrimary, setIosPrimary] = useState<string>();
  const [iosFallback, setIosFallback] = useState<string>();
  const [androidPrimary, setAndroidPrimary] = useState<string>();
  const [androidFallback, setAndroidFallback] = useState<string>();
  const [webUrl, setWebUrl] = useState<string>();
  const [shorterUrl, setShorterUrl] = useState('');
  const [allLinks, setAllLinks] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [editPressed, setEditPressed] = useState(false);
  const [allLinksPressed, setAllLinksPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {

    setLoading(true)
    const data: Data = {
      slug,
      web: webUrl,
      ios: {
        primary: iosPrimary,
        fallback: iosFallback
      },
      android: {
        primary: androidPrimary,
        fallback: androidFallback
      }
    }

    if (editPressed) {
      // edit short link
      delete data.slug
      if (slug == '') {
        setLoading(false)
        return setError('Please enter link\'s slug ')
      }
      axios.put(`shortlinks/${slug}`, data)
        .then(
          (res) => {
            console.log(res);
            setShorterUrl(res.data.shortlink)
            setOpen(true);
            setLoading(false)
            setError('')

          }
        ).catch((err) => {

          setLoading(false)
          console.log(err.response.data?.err?.msg);
          setError(err.response.data?.err?.msg == 'Not found!' ? "Incorrect slug" : err.response.data?.err?.msg)
          console.log(error);


        })
    } else {
      //create new short link
      axios.post('shortlinks', data)
        .then(
          (res) => {
            console.log(res);
            setShorterUrl(res.data.shortlink)
            setLoading(false)
            setError('')

          }
        ).catch((err) => {

          setLoading(false)
          setError(err.response.data?.err?.msg)
          console.log(err.response.data);

        })
    }
  }

  // Get all Links 
  useEffect(() => {
    if (allLinksPressed) {

      axios.get(`shortlinks`)
        .then(
          (res) => {
            console.log(res);
            setAllLinks(res.data.allLinks)
            setLoading(false)

          }
        ).catch((err) => {
          setLoading(false)
          console.log(error)
        })
    }
  }, [allLinksPressed])

  const handlelabel = (label: string, dest: string = '') => {
    if (error.match(dest)) {
      return error
    }
    return label
  }

  const handleInputError = (label: string) => {
    if (error.match(label)) {
      return true
    }
    return false
  }

  const handleEditBtn = () => {
    setEditPressed(!editPressed)
  }

  const handleGetAll = () => {
    setAllLinksPressed(!allLinksPressed)
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  return (
    <Box sx={{ bgcolor: style.background_blue }}>
      <Container sx={{ display: 'flex', flexDirection: "column", alignItems: "center", height: "100vh", p: 2 }}>

        {/********************************** Top Bar *************************/}
        <Box sx={{
          color: style.light_blue,
          display: 'flex',
          flexDirection: "row"
          , alignItems: "center",
          justifyContent: "space-between",
          width: "inherit",
        }}>
          <Stack
            direction="row"
          >

            <Typography variant="h4" noWrap component="div" sx={{ color: style.white, pr: 1 }}>
              Shorter
            </Typography>
            <Typography variant="h4" noWrap component="div" >
              Link
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            alignItems='center'
          >

            <Button
              onClick={handleGetAll}
              variant='contained'
              size='small'
              disableElevation color='secondary'
              endIcon={<SummarizeIcon />}
              sx={{
                ":hover": { border: `1px solid ${style.yellow}` },
                border: allLinksPressed ? `1px solid ${style.yellow}` : `1px solid ${style.btn_border_blue}`,
                py: 1, px: 2
              }}>
              All Links </Button>
            <Button
              onClick={handleEditBtn}
              variant='contained'
              size='small'
              disableElevation color='secondary'
              endIcon={<EditIcon />}
              sx={{
                ":hover": { border: `1px solid ${style.yellow}` },
                border: editPressed ? `1px solid ${style.yellow}` : `1px solid ${style.btn_border_blue}`,
                py: 1, px: 2
              }}>
              Edit Link </Button>
          </Stack>
        </Box>

        {/********************** Main Section ************************/}
        <Stack
          direction='row'
          spacing={4}
          sx={{ width: "inherit", mt: 3 }}>

          {/****************** Form Begin ******************************/}
          <FormGroup sx={{ width: "inherit" }}>

            <Stack
              direction="column"
              spacing={1}
              sx={{ width: "inherit" }}>
              <Typography sx={{ color: style.light_blue, pt: 1 }}>
                Slug
              </Typography>
              <TextField onChange={(e) => setSlug(e.target.value)} value={slug} label={editPressed ? handlelabel('Link\'s Slug', 'slug') : handlelabel('optional', 'slug')} error={handleInputError("slug")} variant="outlined" size='small' />

            </Stack>
            <Stack
              direction="column"
              spacing={1}
              sx={{ width: "inherit" }}>
              <Typography sx={{ color: style.light_blue, pt: 1 }}>
                IOS
              </Typography>
              <TextField onChange={(e) => setIosPrimary(e.target.value)} value={iosPrimary} label={handlelabel('primary', 'ios.primary')} error={handleInputError("ios.primary")} variant="outlined" size='small' fullWidth />
              <TextField onChange={(e) => setIosFallback(e.target.value)} value={iosFallback} label={handlelabel("fallback", 'ios.fallback')} error={handleInputError("ios.fallback")} variant="outlined" size='small' fullWidth />

            </Stack>
            <Stack
              direction="column"
              spacing={1}
              sx={{ width: "inherit" }}>
              <Typography sx={{ color: style.light_blue, pt: 1 }}>
                Android
              </Typography>
              <TextField onChange={(e) => setAndroidPrimary(e.target.value)} value={androidPrimary} label={handlelabel('primary', 'android.primary')} error={handleInputError("android.primary")} variant="outlined" size='small' fullWidth />
              <TextField onChange={(e) => setAndroidFallback(e.target.value)} value={androidFallback} label={handlelabel('fallback', 'android.fallback')} error={handleInputError("android.fallback")} variant="outlined" size='small' fullWidth />

            </Stack>
            <Stack
              direction="column"
              spacing={1}
              sx={{ width: "inherit" }}>
              <Typography sx={{ color: style.light_blue, pt: 1 }}>
                Web
              </Typography>
              <TextField onChange={(e) => setWebUrl(e.target.value)} value={webUrl} label={handlelabel('long url', 'web')} error={handleInputError("web")} variant="outlined" size='small' fullWidth />
            </Stack>


            <Button onClick={handleSubmit} variant='contained' disableElevation color='secondary' endIcon={<SendIcon />}

              sx={{ ":hover": { border: `1px solid ${style.yellow}` }, border: `1px solid ${style.btn_border_blue}`, py: 2, px: 3, mt: 2 }}> Submit </Button>

          </FormGroup>

          {/***************************** Result Section ***************************/}
          <Stack
            direction="column"
            spacing={4}
            justifyContent="center"
            alignItems='center'
            sx={{ width: "70%", position: "relative" }}>
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
              alignItems='center'
              sx={{ width: '100%', mt: 2 }}
            >
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ style: { color: style.white } }}
                value={shorterUrl}
                label="Shorted url" color='info' variant="outlined" focused size='medium' fullWidth />

              <Box sx={{
                width: "100%", display: loading ? 'block' : 'none',
              }}>
                <LinearProgress />
              </Box>
            </Stack>
            <List
              sx={{
                mt: 1,
                width: '100%',
                maxWidth: 500,
                bgcolor: style.dark_blue,
                overflow: 'auto',
                maxHeight: 300,
                display: allLinksPressed ? 'block' : 'none'
              }}>
              {allLinks.map((link: string) => {
                return (<ListItem>
                  <ListItemText
                    primary={link}
                  />
                </ListItem>)
              })}
            </List>
          </Stack>

        </Stack>
      </Container>

      <Snackbar anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }} open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} color='success' severity="success" sx={{ width: '100%' }}>
          Link updated successfuly!
        </Alert>
      </Snackbar>

    </Box >
  )
}

export default Home